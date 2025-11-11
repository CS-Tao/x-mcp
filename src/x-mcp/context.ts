import type { RequestHandlerExtra } from '@modelcontextprotocol/sdk/shared/protocol.js';
import type { ServerNotification, ServerRequest } from '@modelcontextprotocol/sdk/types.js';
import type { ZodOptional, ZodRawShape, ZodType, ZodTypeAny, ZodTypeDef, z } from 'zod/v3';
import type { XMCPOptions } from './option';

export type XMCPContext<Custom extends object = object> = XMCPOptions & {
  modName: string;
  modVersion: string;
  actionType: 'tool' | 'prompt' | 'resource';
  actionName: string;
} & Custom;

export type ToolContext<Args extends ZodRawShape = ZodRawShape, Custom extends object = object> = XMCPContext<
  Custom & {
    actionType: 'tool';
    args: z.objectOutputType<Args, ZodTypeAny>;
    extra: RequestHandlerExtra<ServerRequest, ServerNotification>;
  }
>;

export interface PromptArgsRawShape {
  [k: string]: ZodType<string, ZodTypeDef, string> | ZodOptional<ZodType<string, ZodTypeDef, string>>;
}

export type PromptContext<
  Args extends PromptArgsRawShape = PromptArgsRawShape,
  Custom extends object = object,
> = XMCPContext<
  Custom & {
    actionType: 'prompt';
    args: z.objectOutputType<Args, ZodTypeAny>;
    extra: RequestHandlerExtra<ServerRequest, ServerNotification>;
  }
>;

export type ResourceContext<Custom extends object = object> = XMCPContext<
  Custom & { actionType: 'resource'; uri: URL; extra: RequestHandlerExtra<ServerRequest, ServerNotification> }
>;
