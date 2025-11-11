import type { ResourceMetadata } from '@modelcontextprotocol/sdk/server/mcp.js';
import type {
  CallToolResult,
  GetPromptResult,
  ReadResourceResult,
  ToolAnnotations,
} from '@modelcontextprotocol/sdk/types.js';
import type { ZodRawShape } from 'zod/v3';
import type { PromptArgsRawShape, PromptContext, ResourceContext, ToolContext } from './context';
import type { Promisable } from './utils/type';

export interface Tool<
  InputArgs extends ZodRawShape = ZodRawShape,
  CustomContext extends object = object,
  OutputArgs extends ZodRawShape = ZodRawShape,
> {
  name: string;
  config: {
    title?: string;
    description?: string;
    inputSchema?: InputArgs;
    outputSchema?: OutputArgs;
    annotations?: ToolAnnotations;
  };
  handler: (context: ToolContext<InputArgs, CustomContext>) => Promisable<CallToolResult>;
  initializeContext?: (
    context: ToolContext<InputArgs, CustomContext>,
  ) => Promisable<ToolContext<InputArgs, CustomContext>>;
}

export interface Prompt<
  Args extends PromptArgsRawShape = PromptArgsRawShape,
  CustomContext extends object = object,
> {
  name: string;
  config: {
    title?: string;
    description?: string;
    argsSchema?: Args;
  };
  handler: (context: PromptContext<Args, CustomContext>) => Promisable<GetPromptResult>;
  initializeContext?: <C extends CustomContext = CustomContext>(
    context: ToolContext<Args, CustomContext>,
  ) => Promisable<ToolContext<Args, C>>;
}

export interface Resource<CustomContext extends object = object> {
  name: string;
  uri: string;
  config: ResourceMetadata;
  handler: (context: ResourceContext<CustomContext>) => Promisable<ReadResourceResult>;
  initializeContext?: <C extends CustomContext = CustomContext>(
    context: ResourceContext<CustomContext>,
  ) => Promisable<ResourceContext<C>>;
}

export interface Mod {
  name: string;
  version: string;
  description: string;
  tools?: Tool<ZodRawShape, any, ZodRawShape>[];
  prompts?: Prompt<PromptArgsRawShape, any>[];
  resources?: Resource<any>[];
}

export type ModResult = CallToolResult | GetPromptResult | ReadResourceResult;
