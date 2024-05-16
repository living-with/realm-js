////////////////////////////////////////////////////////////////////////////
//
// Copyright 2024 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////

/* eslint-disable no-console */
/* eslint-env node */

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import assert from "node:assert";

import { globSync } from "glob";

import {
  Configuration,
  PACKAGE_PATH,
  REALM_CORE_LIBRARY_NAMES_DENYLIST,
  // PACKAGE_VERSION,
  REALM_CORE_PATH,
  REALM_CORE_VERSION,
  collectHeaders as commonCollectHeaders,
  copyFiles,
} from "./common";

export const DEFAULT_NDK_VERSION = "25.1.8937393";
export const ANDROID_API_LEVEL = "16";

const INCLUDE_PATH = path.resolve(PACKAGE_PATH, "react-native/android/include");
const ARCHIVES_PATH = path.resolve(PACKAGE_PATH, "react-native/android/libs");

type AndroidArchitecture = "x86" | "armeabi-v7a" | "arm64-v8a" | "x86_64";

export const SUPPORTED_ARCHITECTURES = [
  "x86",
  "armeabi-v7a",
  "arm64-v8a",
  "x86_64",
] as const satisfies readonly AndroidArchitecture[];

export function validateArchitectures(
  values: readonly (AndroidArchitecture | "all" | "infer")[],
): readonly AndroidArchitecture[] {
  if (values.includes("all")) {
    return SUPPORTED_ARCHITECTURES;
  } else if (values.includes("infer")) {
    assert(values.length === 1);
    if (process.arch === "arm64") {
      return ["arm64-v8a"];
    } else if (process.arch === "x64") {
      return ["x86_64"];
    } else {
      throw new Error(`Failed to infer Android arch from host ${process.arch}`);
    }
  } else {
    return values as readonly AndroidArchitecture[];
  }
}

function ensureDirectory(directoryPath: string) {
  // Ensure the build directory exists
  if (!fs.existsSync(directoryPath)) {
    console.log("Creating directory:", directoryPath);
    fs.mkdirSync(directoryPath, { recursive: true });
  }
}

function ensureBuildDirectory(architecture: AndroidArchitecture) {
  const buildPath = path.join(REALM_CORE_PATH, "build-android", architecture);
  ensureDirectory(buildPath);
  return buildPath;
}

type BuildArchiveOptions = {
  cmakePath: string;
  ndkPath: string;
  architecture: AndroidArchitecture;
  configuration: Configuration;
};

export function buildArchive({ cmakePath, ndkPath, architecture, configuration }: BuildArchiveOptions) {
  // Ensure a per architecture build directory
  const buildPath = ensureBuildDirectory(architecture);
  const archiveOutputDirectory = path.join(ARCHIVES_PATH, architecture);
  const toolchainPath = path.join(ndkPath, "build/cmake/android.toolchain.cmake");
  spawnSync(
    cmakePath,
    [
      "-G",
      "Ninja",
      "-S",
      REALM_CORE_PATH,
      "-B",
      buildPath,
      "--toolchain",
      toolchainPath,
      "-D",
      `CMAKE_BUILD_TYPE=${configuration}`,
      "-D",
      "CMAKE_MAKE_PROGRAM=ninja",
      "-D",
      `CMAKE_ARCHIVE_OUTPUT_DIRECTORY=${archiveOutputDirectory}`,
      "-D",
      `ANDROID_NDK=${ndkPath}`,
      "-D",
      // TODO: Does this take more than one value?
      `ANDROID_ABI=${architecture}`,
      "-D",
      "ANDROID_TOOLCHAIN=clang",
      "-D",
      `ANDROID_NATIVE_API_LEVEL=${ANDROID_API_LEVEL}`,
      "-D",
      "ANDROID_STL=c++_shared",
      // TODO: Check that this is even used, it was not needed by the previous build script
      "-D",
      `REALM_VERSION=${REALM_CORE_VERSION}`,
      "-D",
      "REALM_BUILD_LIB_ONLY=ON",
      // TODO: Consider if REALM_ANDROID_ABI, REALM_ANDROID, REALM_PLATFORM needs to be passed
    ],
    { stdio: "inherit" },
  );
  // Invoke the native build tool (Ninja) to build the generated project
  spawnSync(cmakePath, ["--build", buildPath], { stdio: "inherit" });
  // Delete unwanted build artifacts
  for (const name of REALM_CORE_LIBRARY_NAMES_DENYLIST) {
    const libraryPath = path.join(archiveOutputDirectory, name);
    if (fs.existsSync(libraryPath)) {
      console.log("Deleting unwanted library archive file", libraryPath);
      fs.rmSync(libraryPath);
    }
  }
}

// TODO: Determine if this could happen all natively by passing a declaration through Cmake instead
// export function generateVersionFile() {
//   const targetFile = path.resolve(
//     PACKAGE_PATH,
//     "react-native",
//     "android",
//     "src",
//     "main",
//     "java",
//     "io",
//     "realm",
//     "react",
//     "Version.java",
//   );
//   const versionFileContents = `package io.realm.react;

// public class Version {
//     public static final String VERSION = "${PACKAGE_VERSION}";
// }
// `;

//   fs.writeFileSync(targetFile, versionFileContents);
// }

type CollectHeadersOptions = {
  architecture: AndroidArchitecture;
};

export function collectHeaders({ architecture }: CollectHeadersOptions) {
  const buildPath = ensureBuildDirectory(architecture);
  commonCollectHeaders({ buildPath, includePath: INCLUDE_PATH });
}

export function copySSLArchives({ architecture }: CollectHeadersOptions) {
  const buildPath = ensureBuildDirectory(architecture);
  const sslLibsPath = path.join(buildPath, "openssl/lib");
  const sslArchivePaths = globSync(["*.a"], {
    cwd: sslLibsPath,
  });
  const archiveOutputDirectory = path.join(ARCHIVES_PATH, architecture);
  copyFiles(sslLibsPath, sslArchivePaths, archiveOutputDirectory);
}
