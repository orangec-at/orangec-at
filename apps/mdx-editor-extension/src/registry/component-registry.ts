import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export interface ComponentInfo {
  name: string;
  nameKo: string;
  description?: string;
  template: string;
  category: string;
  filePath?: string;
  importPath?: string;
}

export interface BlockInfo {
  id: string;
  name: string;
  nameKo: string;
  template: string;
  category: string;
  icon: string;
}

export class ComponentRegistry {
  private components: Map<string, ComponentInfo> = new Map();
  private blocks: BlockInfo[] = [];
  private workspaceRoot: string;

  constructor(workspaceRoot: string) {
    this.workspaceRoot = workspaceRoot;
  }

  /**
   * 레지스트리 파일에서 컴포넌트 정보를 파싱합니다
   */
  async loadRegistry(): Promise<void> {
    const config = vscode.workspace.getConfiguration('mdxEditor');
    const registryPath = config.get<string>('registryPath', 'src/lib/mdx-registry.ts');
    const blocksPath = config.get<string>('blocksPath', 'src/lib/document-blocks.ts');

    await this.parseRegistryFile(path.join(this.workspaceRoot, registryPath));
    await this.parseBlocksFile(path.join(this.workspaceRoot, blocksPath));
  }

  /**
   * mdx-registry.ts 파일 파싱
   */
  private async parseRegistryFile(filePath: string): Promise<void> {
    if (!fs.existsSync(filePath)) {
      console.warn(`Registry file not found: ${filePath}`);
      return;
    }

    const content = fs.readFileSync(filePath, 'utf-8');

    // MDX_COMPONENT_REGISTRY 객체 추출
    const registryMatch = content.match(/export const MDX_COMPONENT_REGISTRY[^=]*=\s*\{([\s\S]*?)\n\};/);
    if (!registryMatch) {
      console.warn('Could not find MDX_COMPONENT_REGISTRY in file');
      return;
    }

    // 각 컴포넌트 엔트리 파싱 (간단한 정규식 기반)
    const componentPattern = /(\w+):\s*\{[\s\S]*?meta:\s*\{[\s\S]*?id:\s*"([^"]+)"[\s\S]*?name:\s*"([^"]+)"[\s\S]*?nameKo:\s*"([^"]+)"[\s\S]*?category:\s*"([^"]+)"[\s\S]*?template:\s*`([^`]+)`/g;

    let match;
    while ((match = componentPattern.exec(content)) !== null) {
      const [, componentName, id, name, nameKo, category, template] = match;

      // description 추출 (옵셔널)
      const descMatch = content.substring(match.index, match.index + 500).match(/description:\s*"([^"]+)"/);
      const description = descMatch ? descMatch[1] : undefined;

      this.components.set(componentName, {
        name,
        nameKo,
        description,
        template,
        category,
        importPath: this.findComponentImportPath(componentName, content)
      });
    }

    console.log(`Loaded ${this.components.size} components from registry`);
  }

  /**
   * document-blocks.ts 파일 파싱
   */
  private async parseBlocksFile(filePath: string): Promise<void> {
    if (!fs.existsSync(filePath)) {
      console.warn(`Blocks file not found: ${filePath}`);
      return;
    }

    const content = fs.readFileSync(filePath, 'utf-8');

    // DOCUMENT_BLOCKS 배열 추출
    const blocksMatch = content.match(/export const DOCUMENT_BLOCKS[^=]*=\s*\[([\s\S]*?)\n\];/);
    if (!blocksMatch) {
      console.warn('Could not find DOCUMENT_BLOCKS in file');
      return;
    }

    // 각 블록 객체 파싱
    const blockPattern = /\{[\s\S]*?id:\s*"([^"]+)"[\s\S]*?name:\s*"([^"]+)"[\s\S]*?nameKo:\s*"([^"]+)"[\s\S]*?icon:\s*"([^"]+)"[\s\S]*?category:\s*"([^"]+)"[\s\S]*?template:\s*`([^`]+)`[\s\S]*?\}/g;

    let match;
    while ((match = blockPattern.exec(content)) !== null) {
      const [, id, name, nameKo, icon, category, template] = match;

      this.blocks.push({
        id,
        name,
        nameKo,
        template,
        category,
        icon
      });
    }

    console.log(`Loaded ${this.blocks.length} blocks from blocks file`);
  }

  /**
   * 컴포넌트의 import 경로를 찾습니다
   */
  private findComponentImportPath(componentName: string, fileContent: string): string | undefined {
    // import 문에서 컴포넌트 경로 찾기
    const importPattern = new RegExp(`import\\s*\\{[^}]*${componentName}[^}]*\\}\\s*from\\s*["']([^"']+)["']`);
    const match = fileContent.match(importPattern);
    return match ? match[1] : undefined;
  }

  /**
   * 모든 컴포넌트 이름 가져오기
   */
  getComponentNames(): string[] {
    return Array.from(this.components.keys());
  }

  /**
   * 특정 컴포넌트 정보 가져오기
   */
  getComponent(name: string): ComponentInfo | undefined {
    return this.components.get(name);
  }

  /**
   * 모든 블록 가져오기
   */
  getBlocks(): BlockInfo[] {
    return this.blocks;
  }

  /**
   * 카테고리별 블록 가져오기
   */
  getBlocksByCategory(category: string): BlockInfo[] {
    return this.blocks.filter(b => b.category === category);
  }

  /**
   * 컴포넌트 검색 (autocomplete용)
   */
  searchComponents(query: string): ComponentInfo[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.components.values())
      .filter(comp =>
        comp.name.toLowerCase().includes(lowerQuery) ||
        comp.nameKo.includes(query)
      );
  }

  /**
   * 워크스페이스에서 컴포넌트 파일 찾기
   */
  async findComponentFile(componentName: string): Promise<string | undefined> {
    const component = this.components.get(componentName);
    if (!component?.importPath) {
      return undefined;
    }

    // @/ 경로를 src/로 변환
    let relativePath = component.importPath.replace('@/', 'src/');

    // 가능한 확장자들
    const extensions = ['.tsx', '.ts', '.jsx', '.js'];

    for (const ext of extensions) {
      const fullPath = path.join(this.workspaceRoot, relativePath + ext);
      if (fs.existsSync(fullPath)) {
        return fullPath;
      }
    }

    // index 파일도 확인
    for (const ext of extensions) {
      const indexPath = path.join(this.workspaceRoot, relativePath, 'index' + ext);
      if (fs.existsSync(indexPath)) {
        return indexPath;
      }
    }

    return undefined;
  }
}
