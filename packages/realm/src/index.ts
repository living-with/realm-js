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

<<<<<<< HEAD
import { Realm } from "./Realm";
export = Realm;
=======
import {
  AppServicesFunction,
  CanonicalPropertySchema,
  ClientResetRecoverUnsyncedChangesConfiguration,
  Realm,
  RealmObjectConstructor,
  SyncSession,
} from "./internal";

export {
  AggregatePipelineStage,
  ApiKey,
  ApiKeyAuth,
  App,
  AppChangeCallback,
  AppConfiguration,
  AppServicesFunction,
  /** @deprecated Will be removed in v13.0.0. Please use {@link AppServicesFunction} */
  AppServicesFunction as RealmFunction,
  AssertionError,
  BaseConfiguration,
  BaseObjectSchema,
  BaseSubscriptionSet,
  BaseSyncConfiguration,
  BSON,
  BaseChangeEvent,
  CanonicalObjectSchema,
  /** @deprecated Got renamed to {@link CanonicalPropertySchema} */
  CanonicalObjectSchemaProperty,
  CanonicalPropertiesTypes,
  CanonicalPropertySchema,
  ChangeEvent,
  ChangeEventId,
  ClientResetAfterCallback,
  ClientResetBeforeCallback,
  ClientResetConfig,
  ClientResetDiscardUnsyncedChangesConfiguration,
  ClientResetFallbackCallback,
  ClientResetManualConfiguration,
  ClientResetMode,
  ClientResetRecoverOrDiscardUnsyncedChangesConfiguration,
  ClientResetRecoverUnsyncedChangesConfiguration,
  /** @deprecated Got renamed to {@link ClientResetRecoverUnsyncedChangesConfiguration} */
  ClientResetRecoverUnsyncedChangesConfiguration as ClientResetRecoveryConfiguration,
  Collection,
  CollectionChangeCallback,
  CollectionChangeSet,
  CollectionPropertyTypeName,
  CompensatingWriteError,
  CompensatingWriteInfo,
  Configuration,
  ConfigurationWithoutSync,
  ConfigurationWithSync,
  ConnectionNotificationCallback,
  ConnectionState,
  CountOptions,
  Credentials,
  DefaultFunctionsFactory,
  DefaultUserProfileData,
  DeleteEvent,
  DeleteResult,
  Dictionary,
  DictionaryChangeCallback,
  DictionaryChangeSet,
  Document,
  DocumentKey,
  DocumentNamespace,
  DropDatabaseEvent,
  DropEvent,
  EmailPasswordAuth,
  ErrorCallback,
  Filter,
  FindOneAndModifyOptions,
  FindOneOptions,
  FindOptions,
  flags,
  FlexibleSyncConfiguration,
  index,
  IndexDecorator,
  InsertEvent,
  InsertManyResult,
  InsertOneResult,
  InvalidateEvent,
  List,
  LocalAppConfiguration,
  LoggerCallback,
  LoggerCallbackArgs,
  LogArgs,
  LogCategory,
  LogLevel,
  mapTo,
  MapToDecorator,
  MetadataMode,
  Metadata,
  MigrationCallback,
  MongoDB,
  MongoDBCollection,
  MongoDBDatabase,
  MutableSubscriptionSet,
  NewDocument,
  NumericLogLevel,
  /** @deprecated Got renamed to {@link RealmObjectConstructor} */
  RealmObjectConstructor as ObjectClass,
  ObjectChangeCallback,
  ObjectChangeSet,
  ObjectSchema,
  ObjectSchemaParseError,
  ObjectSchemaProperty,
  OpenRealmBehaviorConfiguration,
  OpenRealmBehaviorType,
  OpenRealmTimeOutBehavior,
  OperationType,
  OrderedCollection,
  PartitionSyncConfiguration,
  PartitionValue,
  PrimaryKey,
  PrimitivePropertyTypeName,
  ProgressDirection,
  ProgressMode,
  ProgressNotificationCallback,
  ProgressRealmPromise,
  PropertiesTypes,
  PropertySchema,
  PropertySchemaCommon,
  PropertySchemaParseError,
  PropertySchemaShorthand,
  PropertySchemaStrict,
  PropertyTypeName,
  ProviderType,
  ProxyType,
  Realm,
  RealmEventName,
  RealmObject as Object,
  RealmObjectConstructor,
  RealmSet as Set,
  RelationshipPropertyTypeName,
  RenameEvent,
  ReplaceEvent,
  Results,
  SchemaParseError,
  SessionState,
  SessionStopPolicy,
  SortDescriptor,
  SSLConfiguration,
  SSLVerifyCallback,
  SSLVerifyObject,
  Subscription,
  SubscriptionOptions,
  SubscriptionSet,
  SubscriptionSetState,
  SubscriptionsState,
  Sync,
  SyncConfiguration,
  SyncError,
  SyncSession,
  /** @deprecated Got renamed to {@link SyncSession} */
  SyncSession as Session,
  TypeAssertionError,
  Types,
  Update,
  UpdateDescription,
  UpdateEvent,
  UpdateMode,
  UpdateOptions,
  UpdateResult,
  User,
  UserChangeCallback,
  UserState,
  UserTypeName,
  GeoBox,
  GeoCircle,
  GeoPoint,
  GeoPolygon,
  CanonicalGeoPolygon,
  CanonicalGeoPoint,
  GeoPosition,
  kmToRadians,
  miToRadians,
  WaitForSync,
} from "./internal";

export type Mixed = unknown;
export type ObjectType = string | RealmObjectConstructor;

// Exporting default for backwards compatibility
export default Realm;
>>>>>>> 9d90f43db (Make linter happy)
