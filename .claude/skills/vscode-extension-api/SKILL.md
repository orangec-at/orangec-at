# VS Code Extension API Development Skill

> **Purpose**: Ensure proper VS Code Extension implementation by following official API documentation and examples

## 🎯 When to Use This Skill

**ALWAYS use this skill when:**
- Creating a new VS Code Extension
- Implementing VS Code Extension features (Commands, Views, Webviews, etc.)
- Debugging Extension issues
- User mentions: "VS Code Extension", "vscode extension", "extension development"

**DO NOT start coding before completing this workflow!**

## 📋 Mandatory Workflow

### Step 1: Identify the Feature Type

Ask user to clarify what they want to build:
- [ ] Command
- [ ] TreeView
- [ ] WebviewView
- [ ] Webview Panel
- [ ] Language Server
- [ ] Debugger
- [ ] Theme/Icons
- [ ] Other (specify)

### Step 2: Find Official Sample

**Required Action**: Download and analyze the official sample

```bash
# Clone official samples to codes/ directory
cd codes/
git clone https://github.com/microsoft/vscode-extension-samples.git

# Navigate to relevant sample
cd vscode-extension-samples/<sample-name>/
```

**Official Sample Locations**:
- Commands: `hello-world-sample`
- TreeView: `tree-view-sample`
- WebviewView: `webview-view-sample`
- Webview Panel: `webview-sample`
- Custom Editor: `custom-editor-sample`
- Language Server: `lsp-sample`

### Step 3: Analyze package.json Requirements

**Critical Checklist** (from official sample):

```json
{
  "engines": {
    "vscode": "^1.x.0"  // ✓ Check minimum version
  },
  "activationEvents": [
    // ✓ What activation events are needed?
  ],
  "contributes": {
    // ✓ What contributes sections are required?
    "commands": [],
    "views": [],
    "viewsContainers": [],
    "configuration": []
  }
}
```

**For WebviewView specifically**:
```json
{
  "contributes": {
    "views": {
      "explorer": [  // or custom viewContainer
        {
          "type": "webview",  // ⚠️ CRITICAL: Must specify type!
          "id": "myView",
          "name": "My View"
        }
      ]
    }
  }
}
```

### Step 4: Compare Implementation

Create comparison table:

| Configuration | Official Sample | Our Implementation | Status |
|---------------|----------------|-------------------|---------|
| engines.vscode | `^1.100.0` | ? | ❌ |
| activationEvents | `[]` | ? | ❌ |
| view type | `"webview"` | missing | ❌ |
| ... | ... | ... | ... |

### Step 5: Validate Against Checklist

**WebviewView Checklist**:
- [ ] `package.json` → `contributes.views` → `type: "webview"`
- [ ] `package.json` → `activationEvents` includes view activation
- [ ] Provider implements `WebviewViewProvider` interface
- [ ] Provider has `resolveWebviewView()` method
- [ ] `webview.options` sets `enableScripts: true` if needed
- [ ] `webview.html` is properly set
- [ ] Provider is registered with `vscode.window.registerWebviewViewProvider()`
- [ ] View ID matches between package.json and registration

**Command Checklist**:
- [ ] `package.json` → `contributes.commands` defined
- [ ] Command registered with `vscode.commands.registerCommand()`
- [ ] Command ID matches between package.json and registration

**Configuration Checklist**:
- [ ] `package.json` → `contributes.configuration` defined
- [ ] Settings read with `vscode.workspace.getConfiguration()`
- [ ] Default values provided

### Step 6: Test Official Sample First

**Before implementing custom logic**:

1. Install and run the official sample:
```bash
cd vscode-extension-samples/<sample-name>/
bun install
bun run compile
# Press F5 to test
```

2. Verify it works in your environment
3. If official sample fails → environment issue
4. If official sample works → implementation issue

### Step 7: Implement with Reference

**Development Pattern**:
1. Copy working structure from official sample
2. Rename identifiers (view IDs, command IDs, etc.)
3. Add custom logic incrementally
4. Test after each change

**Never**:
- ❌ Implement from memory/training
- ❌ Skip checking official examples
- ❌ Assume API hasn't changed

## 🔍 Common Mistakes to Avoid

### 1. Missing `"type": "webview"` in package.json

**Wrong**:
```json
"views": {
  "myContainer": [
    {
      "id": "myView",
      "name": "My View"
    }
  ]
}
```

**Correct**:
```json
"views": {
  "myContainer": [
    {
      "type": "webview",  // ← Required!
      "id": "myView",
      "name": "My View"
    }
  ]
}
```

### 2. Mismatched IDs

**package.json**:
```json
"views": {
  "myContainer": [{
    "id": "myExtension.myView"  // ← Must match exactly
  }]
}
```

**extension.ts**:
```typescript
vscode.window.registerWebviewViewProvider(
  'myExtension.myView',  // ← Must match package.json
  provider
);
```

### 3. Wrong Activation Events

**Old API** (deprecated):
```json
"activationEvents": ["onView:myView"]
```

**New API** (preferred):
```json
"activationEvents": []  // Auto-generated
```

### 4. Missing WebviewView Options

**Minimal**:
```typescript
webviewView.webview.options = {
  enableScripts: true  // Required for interactive content
};
```

**Production**:
```typescript
webviewView.webview.options = {
  enableScripts: true,
  localResourceRoots: [this._extensionUri],
  enableForms: true,  // If using forms
  retainContextWhenHidden: true  // Optional: preserve state
};
```

## 📚 Official Resources

### Primary Documentation
- API Reference: https://code.visualstudio.com/api/references/vscode-api
- Extension Guides: https://code.visualstudio.com/api/extension-guides/overview
- UX Guidelines: https://code.visualstudio.com/api/ux-guidelines/overview

### Sample Repository
- All Samples: https://github.com/microsoft/vscode-extension-samples
- WebviewView: https://github.com/microsoft/vscode-extension-samples/tree/main/webview-view-sample

### API Version Compatibility
- Check your VS Code version: `code --version`
- Match `engines.vscode` in package.json to supported features
- Use `@types/vscode` matching your target version

## 🚀 Quick Start Template

### Minimal WebviewView Extension

**package.json**:
```json
{
  "name": "my-extension",
  "engines": { "vscode": "^1.100.0" },
  "activationEvents": [],
  "main": "./out/extension.js",
  "contributes": {
    "views": {
      "explorer": [{
        "type": "webview",
        "id": "myExtension.myView",
        "name": "My View"
      }]
    }
  }
}
```

**extension.ts**:
```typescript
import * as vscode from 'vscode';

class MyProvider implements vscode.WebviewViewProvider {
  resolveWebviewView(webviewView: vscode.WebviewView) {
    webviewView.webview.options = { enableScripts: true };
    webviewView.webview.html = `<html><body><h1>Hello!</h1></body></html>`;
  }
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('myExtension.myView', new MyProvider())
  );
}
```

## ✅ Success Criteria

Extension works when:
- [ ] F5 launches Extension Development Host
- [ ] View appears in sidebar/panel
- [ ] No "data provider" errors
- [ ] Content renders correctly
- [ ] No console errors

## 🐛 Debugging Guide

### Issue: "No registered data provider"

**Checklist**:
1. [ ] `"type": "webview"` in package.json view definition
2. [ ] View ID matches between package.json and `registerWebviewViewProvider()`
3. [ ] Provider implements `WebviewViewProvider` interface
4. [ ] `resolveWebviewView()` method exists and is called
5. [ ] Extension is activated (check activation events)

**Debug Steps**:
1. Add console.log in activate() → verify extension loads
2. Add console.log in resolveWebviewView() → verify provider is called
3. Check Extension Host Developer Tools (Help → Toggle Developer Tools)
4. Compare with working official sample

### Issue: Extension Not Activating

**Check**:
- `activationEvents` in package.json
- Extension shows in Extension panel
- No compilation errors (check `out/` directory)
- Correct `main` entry point in package.json

### Issue: Webview Content Not Showing

**Check**:
- `webview.options.enableScripts` is true
- HTML is valid
- No CSP (Content Security Policy) issues
- Check browser console in webview Developer Tools

## 📝 Post-Implementation Review

After completing implementation:
1. [ ] Compare final code with official sample
2. [ ] Verify all package.json configurations
3. [ ] Test in clean Extension Development Host
4. [ ] Document any deviations from official pattern
5. [ ] Save lessons learned for future reference

---

**Remember**: Official samples are always the source of truth. When in doubt, test the official sample first!
