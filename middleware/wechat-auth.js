export default function ({ store, redirect, route }) {
  if (!store.state.authUser) {
    let { fullPath } = route
    fullPath = encodeURIComponent(fullPath.substr(1))

    return redirect(`/wechat-redirect?visit=${fullPath}`)
  }
}