# Test Files TypeScript Migration Design

## Goal

Migrate all test files from JavaScript to TypeScript for consistency with the source code.

## Current State

- 8 test files + 2 utilities (753 lines total) in JavaScript
- Testing with Mocha 2.5.3 + Chai
- Source code is already TypeScript
- Babel handles transpilation for both JS and TS

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Primary goal | Consistency | Source is TypeScript, tests should match |
| TypeScript strictness | Match source config | Keep everything aligned |
| Tooling changes | Minimal + type definitions | Add @types/mocha and @types/chai for proper typing |
| Migration approach | All at once | 753 lines is manageable, avoids mixed state |

## Files to Convert

| Current File | New File |
|--------------|----------|
| `test/setup.js` | `test/setup.ts` |
| `test/utils/render.js` | `test/utils/render.tsx` |
| `test/ui/context.js` | `test/ui/context.tsx` |
| `test/ui/reset.js` | `test/ui/reset.tsx` |
| `test/ui/reducer.js` | `test/ui/reducer.tsx` |
| `test/ui/key.js` | `test/ui/key.tsx` |
| `test/ui/opts.js` | `test/ui/opts.tsx` |
| `test/ui/defaults.js` | `test/ui/defaults.tsx` |
| `test/ui/validation.js` | `test/ui/validation.tsx` |
| `test/action-reducer/reducer.js` | `test/action-reducer/reducer.ts` |

Files with JSX (React components) use `.tsx`, pure TypeScript files use `.ts`.

## Dependencies

New dev dependencies to add:

```json
{
  "@types/mocha": "10.0.10",
  "@types/chai": "4.3.20"
}
```

## Configuration Changes

### tsconfig.json

Update to include test files:

```json
{
  "include": ["src/**/*", "test/**/*"],
  "exclude": ["node_modules", "transpiled"]
}
```

### No changes needed

- `.babelrc` - Already configured for TypeScript
- `package.json` test script - Mocha with Babel handles new extensions

## Code Changes

### Required changes per file

1. File extension rename (`.js` → `.ts` or `.tsx`)
2. Import path updates where needed
3. Type annotations for React component props in tests
4. Fix any implicit `any` warnings (optional, not errors with current config)

### No changes needed

- Test logic and assertions
- Mocha `describe`/`it` blocks
- Chai assertions
- Redux store setup

## Migration Steps

1. Install type definitions
   ```bash
   npm install --save-dev @types/mocha@10.0.10 @types/chai@4.3.20
   ```

2. Update `tsconfig.json` to include test files

3. Rename all test files to `.ts`/`.tsx`

4. Fix any TypeScript errors (add type annotations where needed)

5. Verify tests pass
   ```bash
   npm test
   ```

## Rollback Plan

Git revert if needed - all changes are additive except file renames.

## Summary

| Category | Count |
|----------|-------|
| Files renamed | 10 |
| New dependencies | 2 |
| Config files modified | 1 |
| Lines of test code | ~753 (minimal edits) |
