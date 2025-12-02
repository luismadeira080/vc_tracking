# MCP Server Setup Guide

This guide explains how to configure Model Context Protocol (MCP) servers for the VC LinkedIn Intelligence Platform.

## What is MCP?

MCP (Model Context Protocol) allows AI assistants like Claude to connect directly to external tools and data sources. This project uses MCP servers for database access, documentation fetching, and filesystem operations.

## Required MCP Servers

This project requires three MCP servers:

1. **PostgreSQL** - Direct database access to Supabase
2. **Fetch** - Retrieve external documentation
3. **Filesystem** - Read/write project files

## Installation Steps

### 1. Install Claude CLI

```bash
npm install -g @anthropic-ai/claude-cli
```

### 2. Configure MCP Servers

The MCP configuration is stored in `.mcp/config.json` (already in this repository).

To activate these servers in your Claude CLI:

```bash
# Copy the MCP config to Claude's config location
cp .mcp/config.json ~/.config/claude/mcp_servers.json
```

Or manually merge the contents if you have existing MCP servers.

### 3. Set Environment Variables

The PostgreSQL MCP server requires the `SUPABASE_CONNECTION_STRING` environment variable.

Add to your `.env.local`:

```bash
SUPABASE_CONNECTION_STRING=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

Then export it:

```bash
export SUPABASE_CONNECTION_STRING="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

For permanent configuration, add to your shell profile (`~/.zshrc` or `~/.bashrc`):

```bash
echo 'export SUPABASE_CONNECTION_STRING="postgresql://..."' >> ~/.zshrc
source ~/.zshrc
```

## Testing Connections

### Test PostgreSQL MCP Server

Start the Claude CLI and try a database query:

```bash
claude
```

Then ask Claude:

```
Can you query the vc_companies table and show me all tracked companies?
```

If configured correctly, Claude should access the database via MCP.

### Test Fetch MCP Server

Ask Claude to fetch documentation:

```
Can you fetch the latest Supabase documentation on Server-Side Rendering?
```

### Test Filesystem MCP Server

The filesystem server should already have access to this project directory.

```
Can you list all files in the docs/ directory?
```

## Troubleshooting

### Issue: "MCP server not found"

**Solution:** Ensure MCP servers are installed and accessible:

```bash
npx -y @modelcontextprotocol/server-postgres --version
npx -y @modelcontextprotocol/server-fetch --version
npx -y @modelcontextprotocol/server-filesystem --version
```

### Issue: "Connection string not set"

**Solution:** Verify the environment variable is exported:

```bash
echo $SUPABASE_CONNECTION_STRING
```

Should output your connection string. If empty, re-export the variable.

### Issue: "Permission denied"

**Solution:** Ensure your Supabase connection string uses the correct credentials with proper permissions.

## Advanced Configuration

### Custom Filesystem Paths

To add additional filesystem access paths, edit `.mcp/config.json`:

```json
{
  "filesystem": {
    "args": [
      "-y",
      "@modelcontextprotocol/server-filesystem",
      "/path/to/project",
      "/another/path"
    ]
  }
}
```

### Multiple Database Connections

To connect to multiple databases, add additional server entries:

```json
{
  "supabase-postgres": { /* existing */ },
  "analytics-postgres": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-postgres"],
    "env": {
      "POSTGRES_CONNECTION_STRING": "${ANALYTICS_DB_CONNECTION_STRING}"
    }
  }
}
```

## Resources

- [MCP Documentation](https://modelcontextprotocol.io)
- [Claude CLI Documentation](https://github.com/anthropics/claude-cli)
- [Supabase Connection Strings](https://supabase.com/docs/guides/database/connecting-to-postgres)
