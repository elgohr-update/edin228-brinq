import uuid from 'react-uuid'
import { BsBox, BsPlusLg, BsClipboard, BsCheckCircleFill } from 'react-icons/bs'
import { FaRegPaperPlane } from 'react-icons/fa'
import { FiMail } from 'react-icons/fi'
import { RiLinksLine } from 'react-icons/ri'
import { HiOutlineOfficeBuilding } from 'react-icons/hi'
import { MdOutlineStickyNote2, MdOutlineFolderShared } from 'react-icons/md'
import {
  AiOutlineEdit,
  AiOutlineFile,
  AiOutlineLeft,
  AiOutlineDown,
  AiOutlineRight,
  AiOutlineUp,
  AiOutlineCalendar,
  AiOutlineStar,
  AiOutlineDelete
} from 'react-icons/ai'
import {
  BiNotepad,
  BiCommentDetail,
  BiCommentAdd,
  BiCircle,
  BiTask
} from 'react-icons/bi'
import { DateTime } from "luxon";

export const getConstantIcons = (item) => {
  return item == 'policy' ? (
    <BsBox />
  ) : item == 'activity' ? (
    <MdOutlineStickyNote2 />
  ) : item == 'client' ? (
    <MdOutlineFolderShared />
  ) : item == 'deal' ? (
    <BsClipboard />
  ) : item == 'emailCompose' ? (
    <FaRegPaperPlane />
  ) : item == 'email' ? (
    <FiMail />
  ) : item == 'plus' ? (
    <BsPlusLg />
  ) : item == 'calendar' ? (
    <AiOutlineCalendar />
  ) : item == 'note' ? (
    <BiNotepad />
  ) : item == 'down' ? (
    <AiOutlineDown />
  ) : item == 'left' ? (
    <AiOutlineLeft />
  ) : item == 'right' ? (
    <AiOutlineRight />
  ) : item == 'up' ? (
    <AiOutlineUp />
  ) : item == 'comment' ? (
    <BiCommentDetail />
  ) : item == 'newComment' ? (
    <BiCommentAdd />
  ) : item == 'circleCheck' ? (
    <BsCheckCircleFill />
  ) : item == 'circle' ? (
    <BiCircle />
  ) : item == 'file' ? (
    <AiOutlineFile />
  ) : item == 'link' ? (
    <RiLinksLine />
  ) : item == 'agency' ? (
    <HiOutlineOfficeBuilding />
  ) : item == 'edit' ? (
    <AiOutlineEdit />
  ) : item == 'trash' ? (
    <AiOutlineDelete />
  ) : item == 'star' ? (
    <AiOutlineStar />
  ) : item == 'task' ? (
    <BiTask />
  ) : null
}

export const truncateString = (str, num) => {
  if (str.length > num) {
    return str.slice(0, num) + '...'
  } else {
    return str
  }
}

export const formatMoney = (number) => {
  if (typeof number === 'string' || number === undefined) {
    return ''
  } else {
    return number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
  }
}

export const getTemplateId = () => {
  const tempId =
    uuid() +
    String(new Date().getTime()) +
    String(Math.floor(Math.random() * 80))
  return tempId
}

export const textAbbrev = (text) => {
  return text.length > 6
    ? text
        .match(/[\p{Alpha}\p{Nd}]+/gu)
        .reduce(
          (previous, next) =>
            previous +
            (+next === 0 || parseInt(next) ? parseInt(next) : next[0] || ''),
          ''
        )
        .toUpperCase()
    : text
}

export const timeout = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const useApi = async (method, path, token) => {
  const req = await fetch(`${process.env.FETCHBASE_URL}${path}`, {
    method: `${method}`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  const res = await req.json()
  return res
}

export const useNextApi = async (method, path, body = null) => {
  if (body) {
    const req = await fetch(`${path}`, {
      method: `${method}`,
      body,
    })
    const res = await req.json()
    return res
  } else {
    const req = await fetch(`${path}`, {
      method: `${method}`,
    })
    const res = await req.json()
    return res
  }
}

export const getSearch = (data, search = '') => {
  function flattenDeep(val) {
    return Object.values(val || []).reduce(
      (acc, val) =>
        typeof val === 'object'
          ? acc.concat(flattenDeep(val))
          : acc.concat(val),
      []
    )
  }

  function getValues(obj) {
    return flattenDeep(obj).filter(function (item) {
      return typeof item === 'string' || typeof item === 'number'
    })
  }

  function normalize(text) {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
  }

  const searchNormalize = normalize(search)

  return data.filter((item) => {
    return normalize(getValues(item).toString()).indexOf(searchNormalize) != -1
  })
}

export const getFormattedDate = (date) => {
  const reformat = DateTime.fromISO(date, { zone: 'utc'}).toUTC()
  const base = DateTime.fromISO(reformat)
  const d = base.toLocaleString(DateTime.DATE_SHORT)
  return d
}

export const getFormattedDateTime = (date) => {
  const reformat = DateTime.fromISO(date, { zone: 'utc'}).toUTC()
  const base = DateTime.fromISO(reformat)
  const d = base.toLocaleString(DateTime.DATETIME_MED)
  return d
}

export const getFormattedUTCDateTime = (date) => {
  const reformat = DateTime.fromISO(date, { zone: 'utc'}).toUTC()
  const base = DateTime.fromISO(reformat)
  const d = base.toLocaleString(DateTime.DATETIME_MED)
  return d
}

export const toMonthName = (monthNumber) => {
  const date = new Date()
  date.setMonth(monthNumber)

  return date.toLocaleString('en-US', {
    month: 'long',
  })
}

export const reverseList = (list) => {
  if (list) {
    return list?.map((value, index, arr) => arr[arr.length - index - 1])
  }
  return []
}

export const sumFromArrayOfObjects = (data = [], field) => {
  let total = data?.reduce(function (tot, record) {
    return tot + record[field]
  }, 0)
  return total
}

export const sumFromArray = (data = []) => {
  let total = data?.reduce(function (tot, record) {
    return tot + record
  }, 0)
  return total
}

export const sortByProperty = (data = [], prop = '') => {
  const sorted = data.sort((a, b) => (a[prop] < b[prop] ? 1 : -1))
  return sorted
}

export const basicSort = (data = []) => {
  const sorted = data.sort((a, b) => (a < b ? 1 : -1))
  return sorted
}

export const getMonths = () => {
  return [
    {
      month: 'Jan',
      m: 0,
    },
    {
      month: 'Feb',
      m: 1,
    },
    {
      month: 'Mar',
      m: 2,
    },
    {
      month: 'Apr',
      m: 3,
    },
    {
      month: 'May',
      m: 4,
    },
    {
      month: 'Jun',
      m: 5,
    },
    {
      month: 'Jul',
      m: 6,
    },
    {
      month: 'Aug',
      m: 7,
    },
    {
      month: 'Sep',
      m: 8,
    },
    {
      month: 'Oct',
      m: 9,
    },
    {
      month: 'Nov',
      m: 10,
    },
    {
      month: 'Dec',
      m: 11,
    },
  ]
}

export const abbreviateMoney = (num, fixed) => {
  if (num === null) {
    return null
  } // terminate early
  if (num === 0) {
    return '0'
  } // terminate early
  fixed = !fixed || fixed < 0 ? 0 : fixed // number of decimal places to show
  var b = num.toPrecision(2).split('e'), // get power
    k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3), // floor at decimals, ceiling at trillions
    c =
      k < 1
        ? num.toFixed(0 + fixed)
        : (num / Math.pow(10, k * 3)).toFixed(1 + fixed), // divide by power
    d = c < 0 ? c : Math.abs(c), // enforce -0 is 0
    e = d + ['', 'K', 'M', 'B', 'T'][k] // append power
  return e
}
