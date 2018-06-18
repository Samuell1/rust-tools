import { Router } from 'express'
import { GraphQLClient } from 'graphql-request'

const router = Router()
const client = new GraphQLClient('https://api.graph.cool/simple/v1/cj8g20g6q030q0156airzo84g')

router.get('/find/:query', async ({ params }, res, next) => {
  if (!params.query || params.query.length < 2) {
    return res.send(`Please write name of a item!`)
  }

  try {
    const search = await client.request(`
      query allLoots($search: String) {
        allLoots(filter: {OR: [{dataId_contains: $search}, {name_contains: $search}]}, first: 1) {
          name
        }
      }
      `, {
        search: decodeURIComponent(params.query)
      })

    if (!search.allLoots.length) {
      return res.send(`Nothing founded :(`)
    }

    const { allLoots } = await client.request(`
      query allLoots($search: String) {
        allLoots(filter: {OR: [{dataId_contains: $search}, {name_contains: $search}]}, first: 3) {
          name
          percentage
          crate {
            name
          }
        }
      }
      `, {
        search: search.allLoots[0].name
      })

    let items = []
    allLoots.forEach(item => {
      items.push(`${item.crate.name}(${item.percentage}%)`)
    })

    res.send(`${search.allLoots[0].name} > ${items.join(', ')}`)
  } catch (error) {
    return res.send(`Something went wrong.`)
  }
})

export default router
