import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

export type { StdioServerTransport };

export const createStdioTransport = () => new StdioServerTransport();
