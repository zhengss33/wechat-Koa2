import cheerio from 'cheerio'
import rp from 'request-promise'
import R from 'ramda'
import { writeFileSync } from 'fs'
import { resolve } from 'path'

const sleep = time => new Promise(resolve => setTimeout(resolve, time))

export const getIMDBCharacters = async () => {
  const options = {
    uri: 'https://www.imdb.com/title/tt0373889/fullcredits?ref_=tt_cl_sm#cast',
    transform: body => cheerio.load(body)
  }
  let imdbList = []

  const $ = await rp(options)

  $('table.cast_list tr.odd, tr.even').each(function () {
    const nmIdDom = $(this).find('td.primary_photo a')
    const nmId = nmIdDom.attr('href')
    const characterDom = $(this).find('td.character a')
    const name = characterDom.text()
    const playedByDom = $(this).find('td').eq(1).find('a')
    const playedBy = playedByDom.text().trim()

    imdbList.push({
      nmId,
      name,
      playedBy
    })
  })

  console.log('共拿到 ' + imdbList.length + ' 条数据')

  const filterData = R.compose(
    R.map(imdb => {
      const nameReg = /\/name\/(.*?)\/\?ref/
      imdb.nmId = imdb.nmId.match(nameReg)[1]
      return imdb
    }),
    R.filter(imdb => imdb.playedBy && imdb.name && imdb.nmId)
  )

  imdbList = filterData(imdbList)

  console.log('清洗后，剩余 ' + imdbList.length + ' 条数据')

  writeFileSync(resolve(__dirname, '../database/json/imdb.json'), JSON.stringify(imdbList, null, 2), 'utf8')
}

// getIMDBCharacters()

const fetchIMDBImage = async (url) => {
  const options = {
    uri: url,
    transform: body => cheerio.load(body)
  }

  const $ = await rp(options)
  let images = []

  $('div.media_index_thumb_list a img').each(function () {
    let src = $(this).attr('src')

    if (src) {
      src = src.split('_V1').shift()
      src += '_V1.jpg'
      images.push(src)
    }
  })

  return images
}

export const getIMDBImages = async () => {
  const characters = require(resolve(__dirname, '../database/json/imdb.json'))

  for (let i = 0; i < characters.length; i++) {
    if (!characters[i].images) {
      const url = `https://www.imdb.com/title/tt0373889/characters/${characters[i].nmId}?ref_=tt_cl_t1`
      console.log('正在爬取 ' + characters[i].name)
      const images = await fetchIMDBImage(url)
      console.log('已经爬到 ' + images.length)

      characters[i].images = images

      writeFileSync(resolve(__dirname, '../database/json/characters.json'), JSON.stringify(characters, null, 2), 'utf8')

      sleep(500)
    }
  }
}

getIMDBImages()
