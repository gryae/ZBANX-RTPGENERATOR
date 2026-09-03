declare module "next" {
  export interface Metadata {
    title?: string | { default: string; template: string };
    description?: string;
    keywords?: string[];
    authors?: Array<{ name: string; url?: string }>;
    robots?: string | { index: boolean; follow: boolean };
    [key: string]: any;
  }
  export type NextConfig = {
    [key: string]: any;
  };
  export type ResolvingMetadata = Promise<Metadata>;
  export type ResolvingViewport = Promise<any>;
}

declare module "next/font/google" {
  export interface FontOptions {
    variable?: string;
    subsets?: string[];
    display?: string;
    weight?: string | string[];
    [key: string]: any;
  }
  export interface FontClass {
    className: string;
    variable: string;
    style: { fontFamily: string };
  }
  export function Inter(options?: FontOptions): FontClass;
  export function Geist_Mono(options?: FontOptions): FontClass;
  export function Roboto(options?: FontOptions): FontClass;
  export function Outfit(options?: FontOptions): FontClass;
}

declare module "next/server" {
  export class NextRequest extends Request {
    readonly nextUrl: URL;
    readonly cookies: any;
    readonly ip?: string;
    readonly geo?: any;
  }
  export class NextResponse<Body = any> extends Response {
    static json<T = any>(body: T, init?: ResponseInit): NextResponse<T>;
    static redirect(url: string | URL, status?: number): NextResponse;
    static next(init?: ResponseInit): NextResponse;
  }
}

declare module "next/types.js" {
  export type ResolvingMetadata = Promise<any>;
  export type ResolvingViewport = Promise<any>;
  export type * from "next";
}

declare module "next/server.js" {
  export * from "next/server";
}
