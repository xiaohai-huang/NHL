// @ts-nocheck

export const PYODIDE_URL =
  "https://cdn.jsdelivr.net/pyodide/v0.20.0/full/pyodide.js";

function load_script(url) {
  const script = document.createElement("script");

  script.src = url;
  script.defer = true;

  document.body.appendChild(script);
  return new Promise((resolve) => {
    script.onload = () => {
      console.log(`Loaded script: ${url}`);
      resolve();
    };
  });
}

const loadPackage = async function (
  package_name: string[] | string,
  runtime: any
): Promise<void> {
  if (package_name.length > 0) {
    const micropip = runtime.globals.get("micropip");
    await micropip.install(package_name);
    micropip.destroy();
  }
};

const createPyodide = async () => {
  const loadPyodide = window.loadPyodide;
  const pyodide = await loadPyodide({
    stdout: console.log,
    stderr: console.log,
    fullStdLib: false,
  });

  console.log("loading micropip");
  await pyodide.loadPackage("micropip");
  await pyodide.runPythonAsync("import micropip");

  const PACKAGES = ["numpy", "pandas", "scipy"];
  await loadPackage(PACKAGES, pyodide);

  return pyodide;
};

const getPython = (async () => {
  await load_script(PYODIDE_URL);
  console.log("loading pyodide");
  const pyodide = await createPyodide();
  window.pyodide = pyodide;
  return pyodide;
})();

export default getPython;
