import cheerio from 'cheerio'
import rp from 'request-promise'
import R from 'ramda'
import _ from 'lodash'
import { resolve } from 'path'
import { writeFileSync } from 'fs'
import randomToken from 'random-token'
import { fetchImage } from '../libs/qiniu'

const sleep = time => new Promise(resolve => setTimeout(resolve, time))

const normalizedContent = content => _.reduce(content, (acc, item) => {
  if (item.text) acc.push(item.text)

  if (item.elements && item.elements.length) {
    let _acc = normalizedContent(item.elements)

    acc = R.concat(acc, _acc)
  }

  return acc
}, [])

const normalizedSections = R.compose(
  R.nth(1),
  R.splitAt(1),
  R.map(i => ({
    level: i.level,
    title: i.title,
    content: normalizedContent(i.content)
  }))
)

const getWikiId = async data => {
  const query = data.cname || data.name
  const url = `https://harrypotter.fandom.com/zh/api/v1/Search/List?query=${encodeURI(query)}`
  let res = {}
  try {
    res = await rp(url)
  } catch (e) {
    console.log(e)
  }
  res = JSON.parse(res).items[0]
  return R.merge(data, res)
}

const getWikiDetail = async data => {
  if (data.id) {
    const { id } = data
    const url = `https://harrypotter.fandom.com/zh/api/v1/Articles/AsSimpleJson?id=${id}`
    let res

    try {
      res = await rp(url)
    } catch (e) {
      console.log(e)
    }

    const getCNameAndIntro = R.compose(
      i => ({
        cname: i.title,
        intro: R.map(R.prop(['text']))(i.content)
      }),
      R.pick(['title', 'content']),
      R.nth(0),
      R.filter(R.propEq('level', 1)),
      R.prop('sections')
    )

    const getLevel = R.compose(
      R.project(['title', 'content', 'level']),
      R.reject(R.propEq('title', '扩展阅读')),
      R.reject(R.propEq('title', '引用与注释')),
      R.filter(i => i.content.length),
      R.prop('sections')
    )

    res = JSON.parse(res)
    const cnameIntro = getCNameAndIntro(res)
    let body = R.merge(data, cnameIntro)
    let sections = getLevel(res)

    sections = normalizedSections(sections)

    body.sections = sections
    body.wikiId = id

    return R.pick(['name', 'cname', 'playedBy', 'profile', 'images', 'nmId', 'chId', 'sections', 'intro', 'wikiId', 'words'], body)
  }
}

export const getWikiCharacters = async () => {
  let data = require(resolve(__dirname, '../database/json/vaildCharacters.json'))
  console.log('总共' + data.length + '条数据')
  data = R.map(getWikiId, data)
  data = await Promise.all(data)
  console.log('获取 wiki Id')
  console.log(data[0])

  data = R.map(getWikiDetail, data)
  data = await Promise.all(data)
  console.log('获取 wiki 详细资料')
  console.log(data[0])

  data = R.filter(item => item && item.nmId, data)

  writeFileSync(resolve(__dirname, '../database/json/wikiCharacters.json'), JSON.stringify(data, null, 2), 'utf8')
}

// getWikiCharacters()

const GOLLEGES = [
  {
    name: 'Gryffindor',
    cname: '格兰芬多',
    slogan: '你也许属于格兰芬多，那里有埋藏在心底的勇敢，他们的胆识、气魄和豪爽，使格兰芬多出类拔萃。'
  },
  {
    name: 'Slytherin',
    cname: '斯莱特林',
    slogan: '也许你会进斯菜特林，也许你在这里交上真诚的朋友，但那些狡诈阴险之辈却会不惜一切手段，去达到他们的目的。'
  },
  {
    name: 'Hufflepuff',
    cname: '赫奇帕奇',
    slogan: '你也许属于赫奇帕奇，那里的人正直忠诚，赫奇帕奇的学子们坚忍诚实，不畏惧艰辛的劳动。'
  },
  {
    name: 'Ravenclaw',
    cname: '拉文克劳',
    slogan: '如果你头脑精明，或许会进智慧的老拉文克劳，那些睿智博学的人，总会在那里遇见他们的同道。'
  }
]

export const getColleges = async () => {
  let promise = R.map(getWikiId, GOLLEGES)
  let data = await Promise.all(promise)

  console.log(data[0])
  console.log('ID done! 开始获取 detail')

  promise = R.map(getWikiDetail, data)
  data = await Promise.all(promise)

  writeFileSync(resolve(__dirname, '../database/json/wikiColleges.json'), JSON.stringify(data, null, 2), 'utf8')
}

// getColleges()

export const getMembers = async () => {
  const colleges = require(resolve(__dirname, '../database/json/wikiColleges.json'))
  const characters = require(resolve(__dirname, '../database/json/wikiCharacters.json'))

  const fetchMembers = async data => {
    const options = {
      uri: `https://harrypotter.fandom.com/zh/wiki/${encodeURI(data.cname)}`,
      transform: body => cheerio.load(body)
    }

    console.log('开始获取 ' + data.cname)
    const $ = await rp(options)
    const members = []
    $('table.infoboxtable .infoboxcell').last().find('li').each(function () {
      const member = $(this).find('a').text()
      const character = R.find(R.propEq('cname', member))(characters)
      members.push({
        nmId: character ? character.nmId : '',
        name: member
      })
    })

    console.log(`${data.cname}: ${members}`)
    return R.merge(data, { members })
  }

  const promise = R.map(fetchMembers, colleges)
  const data = await Promise.all(promise)

  writeFileSync(resolve(__dirname, '../database/json/completeColleges.json'), JSON.stringify(data, null, 2), 'utf8')
}

// getMembers()

const fetchProfile = async data => {
  const options = {
    uri: `https://harrypotter.fandom.com/zh/wiki/${encodeURI(data.cname)}`,
    transform: body => cheerio.load(body)
  }

  const $ = await rp(options)

  const profile = $('.portable-infobox img').eq(0).attr('src')

  return R.merge(data, { profile: profile || '' })
}

export const getProfile = async () => {
  const characters = require(resolve(__dirname, '../database/json/wikiCharacters.json'))
  const promise = R.map(fetchProfile, characters)

  console.log('总共' + characters.length + '条数据')
  const data = await Promise.all(promise)

  console.log('爬取完毕')

  writeFileSync(resolve(__dirname, '../database/json/completeCharacters.json'), JSON.stringify(data, null, 2), 'utf8')
}

// getProfile()

export const fetchProfilefromWiki = async () => {
  let characters = require(resolve(__dirname, '../database/json/finalCharaters.json'))

  for (let i = 0; i < characters.length; i++) {
    try {
      if (characters[i].profile.includes('https')) {
        console.log('uploading')
        const key = `${characters[i].nmId}/${randomToken(32)}`
        await fetchImage(characters[i].profile, key)
        console.log(key)
        console.log(characters[i].profile)
        console.log('upload done!')
        characters[i].profile = key

        writeFileSync(resolve(__dirname, '../database/json/finalCharaters.json'), JSON.stringify(characters, null, 2), 'utf8')
        sleep(500)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

// fetchProfilefromWiki()

export const fetchImagefromImdb = async () => {
  const characters = require(resolve(__dirname, '../database/json/finalCharatersData.json'))
  const uploadImage = async data => {
    try {
      for (let i = 0; i < data.images.length; i++) {
        if (data.images[i].includes('https')) {
          let _key = `${data.nmId}/${randomToken(32)}`
          await fetchImage(data.images[i], _key)
          console.log(_key)
          console.log(data.images[i])
          console.log('upload done!')
          data.images[i] = _key

          writeFileSync(resolve(__dirname, '../database/json/finalCharatersData.json'), JSON.stringify(characters, null, 2), 'utf8')
          sleep(500)
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  for (let i = 0; i < characters.length; i++) {
    if (characters[i].images.length) {
      console.log('正在上传 ' + characters[i].cname)
      await uploadImage(characters[i])
    }
  }
}

// fetchImagefromImdb()
