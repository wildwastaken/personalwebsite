const fs = require('node:fs')
const vm = require('node:vm')
const ts = require('typescript')
const React = require('react')

function load(file, dependencies = {}, globals = {}) {
  const exports = {}
  const compiled = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: {module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true},
  }).outputText
  vm.runInNewContext(compiled, {exports, require: name => dependencies[name] || require(name), ...globals})
  return exports
}
function find(node, predicate) {
  if (!node || typeof node !== 'object') return undefined
  if (Array.isArray(node)) return node.map(child => find(child, predicate)).find(Boolean)
  if (predicate(node)) return node
  return find(node.props?.children, predicate)
}
function harness() {
  const state = [], refs = [], callbacks = [], effects = [], pending = []
  let s = 0, r = 0, c = 0, e = 0
  const same = (a, b) => a && a.length === b.length && a.every((value, i) => Object.is(value, b[i]))
  const hooks = {
    ...React,
    useState: initial => {
      const index = s++
      if (!(index in state)) state[index] = typeof initial === 'function' ? initial() : initial
      return [state[index], value => {state[index] = typeof value === 'function' ? value(state[index]) : value}]
    },
    useRef: initial => refs[r++] ||= {current: initial},
    useCallback: (fn, deps) => {
      const index = c++
      if (!same(callbacks[index]?.deps, deps)) callbacks[index] = {fn, deps}
      return callbacks[index].fn
    },
    useEffect: (effect, deps) => {
      const index = e++
      if (!same(effects[index]?.deps, deps)) {
        effects[index]?.cleanup?.()
        effects[index] = {deps}
        pending.push(() => {effects[index].cleanup = effect()})
      }
    },
    useId: () => 'viewer-test',
  }
  return {
    hooks,
    render(component, props, beforeEffects = () => {}) {
      s = r = c = e = 0
      const tree = component(props)
      beforeEffects(tree)
      pending.splice(0).forEach(effect => effect())
      return tree
    },
    unmount() {effects.forEach(effect => effect?.cleanup?.())},
  }
}
module.exports = {load, find, harness}
