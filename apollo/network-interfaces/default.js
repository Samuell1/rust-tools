import { createNetworkInterface } from 'apollo-client'

export default () => {
  const networkInterface = createNetworkInterface({
    uri: 'https://api.graph.cool/simple/v1/cj8g20g6q030q0156airzo84g'
  })
  return {
    networkInterface,
    dataIdFromObject: o => o.id
  }
}
