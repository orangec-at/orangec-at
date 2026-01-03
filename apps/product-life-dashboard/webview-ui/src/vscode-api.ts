// VS Code API는 한 번만 획득 가능하므로 싱글톤으로 관리
let vscodeApi: any = null;

export function getVSCodeAPI() {
  if (!vscodeApi) {
    vscodeApi = window.acquireVsCodeApi();
  }
  return vscodeApi;
}
