---
name: logging-module
description: Create a structured logging subsystem inside @functions-oneui/react-utils/logging with core logger API, processors, transports, React integration, and testing utilities
---

## Objective

Implement a modern logging subsystem inside:

packages/react-utils/src/logging/

Public import target:
@functions-oneui/react-utils/logging

This module must provide structured, extensible logging for the OneUI ecosystem without becoming a separate package.

## Scope

Implement version 1 with:
- logger factory
- log levels
- structured log event model
- child/scoped loggers
- level filtering
- processor pipeline
- console transport
- memory transport
- error normalization
- redaction support
- React provider + hooks
- testing helpers

Do NOT implement vendor-specific telemetry adapters in version 1.

## Architecture Rules

- Keep logging as a dedicated subsystem under react-utils/src/logging
- Core logging must NOT depend on React
- React integration must be layered on top of core
- Use subpath export: @functions-oneui/react-utils/logging
- Do not clutter the root react-utils public API unless needed

## Required Public API

Export the following (or equivalent clearly named API) from the logging subpath:
- createLogger
- LoggerProvider
- useLogger
- useComponentLogger
- createConsoleTransport
- createMemoryTransport
- types for logger config, log event, log levels, error normalization

## Log Levels

Use:
- trace
- debug
- info
- warn
- error
- fatal

## Structured Event Model

Design logs as normalized event objects rather than string-only output.

A log event should support fields such as:
- timestamp
- level
- message
- namespace
- component
- feature
- metadata
- error
- context
- environment
- sourcePackage
- optional correlation/request/session ids

## Child Logger / Context

Support child/scoped loggers that inherit parent configuration and add local context.

This must make it easy for organisms like SmartSection to attach:
- component
- sectionId
- requestKey

## Processors

Implement a pipeline concept with at least:
- enrichers
- filters
- redactors
- serializers

Version 1 may keep this lightweight but the architecture must be extensible.

## Error Handling

Normalize thrown values including:
- Error
- DOMException
- AbortError
- unknown thrown values

Abort-related failures should be identifiable and should not be treated as ordinary errors by default.

## Transports

Version 1 must include:
- console transport
- memory transport

Design transport contracts so additional transports can be added later without redesign.

## React Integration

Implement:
- LoggerProvider
- useLogger
- useComponentLogger

These must wrap core logging without coupling core to React.

## Testing

Add unit tests for:
- log level filtering
- child logger context inheritance
- error normalization
- redaction behavior
- memory transport capture
- React provider/hooks basic behavior

## Documentation

Add a README or docs section describing:
- purpose
- architecture
- public API
- how to use from SmartSection and other components
- how to use memory transport in tests

## Success Criteria

- Module is importable from @functions-oneui/react-utils/logging
- Tests pass
- No dependency direction violations
- Logging is structured, safe, and extensible