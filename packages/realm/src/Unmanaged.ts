////////////////////////////////////////////////////////////////////////////
//
// Copyright 2022 Realm Inc.
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

import type { AnyRealmObject, RealmObject } from "./Object";
import type { AnyCollection } from "./Collection";
import type { Counter } from "./Counter";
import type { AnyDictionary, Dictionary } from "./Dictionary";
import type { AnyList, List } from "./List";
import type { AnySet, RealmSet } from "./Set";

export type ExtractPropertyNamesOfType<T, PropType> = {
  [K in keyof T]: T[K] extends PropType ? K : never;
}[keyof T];

type ExtractPropertyNamesOfTypeExcludingNullability<T, PropType> = {
  [K in keyof T]: Exclude<T[K], null | undefined> extends PropType ? K : never;
}[keyof T];

/**
 * Exchanges properties defined as Realm.Object<Model> with an optional Unmanaged<Model>.
 */
type RealmObjectRemappedModelPart<T> = {
  [K in ExtractPropertyNamesOfType<T, AnyRealmObject>]?: T[K] extends RealmObject<infer GT> ? Unmanaged<GT> : never;
} & {
  [K in ExtractPropertyNamesOfType<T, AnyRealmObject | null>]?: T[K] extends RealmObject<infer GT> | null
    ? Unmanaged<GT> | null
    : never;
};

/**
 * Exchanges properties defined as {@link List} with an optional {@link Array}.
 */
type RealmListRemappedModelPart<T> = {
  [K in ExtractPropertyNamesOfType<T, AnyList>]?: T[K] extends List<infer GT> ? Array<GT | Unmanaged<GT>> : never;
};

/**
 * Exchanges properties defined as {@link Dictionary} with an optional key to mixed value object.
 */
type RealmDictionaryRemappedModelPart<T> = {
  [K in ExtractPropertyNamesOfType<T, AnyDictionary>]?: T[K] extends Dictionary<infer ValueType>
    ? { [key: string]: ValueType }
    : never;
};

/**
 * Exchanges properties defined as {@link RealmSet} with an optional {@link Array}.
 */
type RealmSetRemappedModelPart<T> = {
  [K in ExtractPropertyNamesOfType<T, AnySet>]?: T[K] extends RealmSet<infer GT> ? Array<GT | Unmanaged<GT>> : never;
};

/**
 * Exchanges properties defined as a {@link Counter} with a `number`.
 */
type RealmCounterRemappedModelPart<T> = {
  [K in ExtractPropertyNamesOfTypeExcludingNullability<T, Counter>]?: Counter | number | Exclude<T[K], Counter>;
};

/** Omits all properties of a model which are not defined by the schema */
export type OmittedRealmTypes<T> = Omit<
  T,
  | keyof AnyRealmObject
  /* eslint-disable-next-line @typescript-eslint/ban-types */
  | ExtractPropertyNamesOfType<T, Function> // TODO: Figure out the use-case for this
  | ExtractPropertyNamesOfTypeExcludingNullability<T, Counter>
>;

export type OmittedNestedRealmTypes<T> = Omit<
  T,
  | ExtractPropertyNamesOfType<T, AnyRealmObject>
  | ExtractPropertyNamesOfType<T, AnyRealmObject | null>
  | ExtractPropertyNamesOfType<T, AnyCollection>
  | ExtractPropertyNamesOfType<T, AnyDictionary>
>;

/** Make all fields optional except those specified in K */
type OptionalExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

/**
 * Omits all properties of a model which are not defined by the schema,
 * making all properties optional except those specified in RequiredProperties.
 */
type OmittedRealmTypesWithRequired<T, RequiredProperties extends keyof OmittedRealmTypes<T>> = OptionalExcept<
  OmittedRealmTypes<T>,
  RequiredProperties
>;

/** Remaps realm types to "simpler" types (arrays and objects) */
type RemappedRealmTypes<T> = RealmObjectRemappedModelPart<T> &
  RealmListRemappedModelPart<T> &
  RealmDictionaryRemappedModelPart<T> &
  RealmSetRemappedModelPart<T> &
  RealmCounterRemappedModelPart<T>;

/**
 * Joins `T` stripped of all keys which value extends Realm classes such as {@link List} and {@link Object},
 * with the keys whose values extends Realm classes remapped to simpler types (for example {@link List} is remapped as {@link Array}).
 * All properties are optional except those specified in `RequiredProperties`.
 */
export type Unmanaged<T, RequiredProperties extends keyof OmittedRealmTypes<T> = never> = OmittedRealmTypesWithRequired<
  OmittedNestedRealmTypes<T> & RemappedRealmTypes<T>,
  // @ts-expect-error TODO - what's the cause of "Type string is not assignable to type Exclude<ExtractPropertyNamesOfTypeExcludingNullability<T, Counter>, keyof AnyRealmObject | ExtractPropertyNamesOfType<...> | ExtractPropertyNamesOfTypeExcludingNullability<...>> | ... 5 more ... | Exclude<...>"
  RequiredProperties
>;
