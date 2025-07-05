/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as email_http_sender from "../email/http_sender.js";
import type * as email_internal_sender from "../email/internal_sender.js";
import type * as email_templates_magic_link from "../email/templates/magic_link.js";
import type * as email_utils from "../email/utils.js";
import type * as example from "../example.js";
import type * as http from "../http.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  "email/http_sender": typeof email_http_sender;
  "email/internal_sender": typeof email_internal_sender;
  "email/templates/magic_link": typeof email_templates_magic_link;
  "email/utils": typeof email_utils;
  example: typeof example;
  http: typeof http;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
