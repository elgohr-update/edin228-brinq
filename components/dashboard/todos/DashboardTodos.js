import React, { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { Input, useTheme } from '@nextui-org/react'
import PanelTitle from '../../ui/title/PanelTitle'
import { getSearch, timeout, useNextApi } from '../../../utils/utils'
import { useReloadContext } from '../../../context/state'
import TaskBundleContainer from '../../task/taskbundle/TaskBundleContainer'
import uuid from 'react-uuid'
import { DateTime } from 'luxon'
import TodosNavBar from './TodosNavBar'
import { motion } from 'framer-motion'

export default function DashboardTodos() {
  const [data, setData] = useState(null)
  const [todaysTasks, setTodaysTasks] = useState(null)
  const [thisWeeksTasks, setThisWeeksTasks] = useState(null)
  const [overdueTasks, setOverdueTasks] = useState(null)
  const [todoTab, setTodoTab] = useState(1)
  const [raw, setRaw] = useState(null)
  const { reload, setReload } = useReloadContext()
  const { type } = useTheme()

  useEffect(() => {
    if (reload.policies) {
      let isCancelled = false
      const handleChange = async () => {
        await timeout(100)
        if (!isCancelled) {
          fetchTasks()
          setReload({
            ...reload,
            policies: false,
          })
        }
      }
      handleChange()
      return () => {
        isCancelled = true
      }
    }
  }, [reload])

  useEffect(() => {
    let isCancelled = false
    const handleChange = async () => {
      await timeout(100)
      if (!isCancelled) {
        fetchTasks()
      }
    }
    handleChange()
    return () => {
      isCancelled = true
    }
  }, [])

  const fetchTasks = async () => {
    const res = await useNextApi('GET', `/api/task/list`)
    const format = bundleTasks(res)
    const overDue = formatOverdueTasks(res)
    const todays = formatTodayTasks(res)
    const weeks = formatThisWeeksTasks(res)
    setData(format)
    setRaw(format)
    setOverdueTasks(overDue)
    setThisWeeksTasks(weeks)
    setTodaysTasks(todays)
  }

  const searchData = (val) => {
    if (todoTab == 1) {
      if (val.length > 1) {
        const filtered = getSearch(raw, val)
        setData(filtered)
      } else {
        setData(raw)
      }
    } else if (todoTab == 2) {
      if (val.length > 1) {
        const filtered = getSearch(raw, val)
        setData(filtered)
      } else {
        setData(raw)
      }
    } else if (todoTab == 3) {
      if (val.length > 1) {
        const filtered = getSearch(raw, val)
        setData(filtered)
      } else {
        setData(raw)
      }
    } else if (todoTab == 4) {
      if (val.length > 1) {
        const filtered = getSearch(raw, val)
        setData(filtered)
      } else {
        setData(raw)
      }
    }
  }

  const bundleTasks = (tasks) => {
    const tdt = tasks.filter((b) => b.done === false)
    const dateGroups = tdt.reduce((dateGroups, task) => {
      const date = task.date.split('T')[0]
      if (!dateGroups[date]) {
        dateGroups[date] = []
      }
      dateGroups[date].push(task)
      return dateGroups
    }, {})
    const dateGroupArrays = Object.keys(dateGroups).map((date) => {
      const clientGroups = dateGroups[date].reduce((clientGroups, task) => {
        const clientId = task.client_id
        if (!clientGroups[clientId]) {
          clientGroups[clientId] = []
        }
        clientGroups[clientId].push(task)
        return clientGroups
      }, {})
      const clientArray = Object.keys(clientGroups).map((data) => {
        return {
          uid: uuid(),
          client_id: data,
          client_name: clientGroups[data][0].client_name,
          line: clientGroups[data][0].line,
          tasks: clientGroups[data],
        }
      })
      // dateGroups[date]
      return {
        uid: uuid(),
        date,
        clients: clientArray,
      }
    })
    return dateGroupArrays
  }

  const formatOverdueTasks = (tasks) => {
    const today = new Date()
    const tdt = tasks.filter(
      (b) => b.done === false && new Date(b.date) < today
    )
    const dateGroups = tdt.reduce((dateGroups, task) => {
      const date = task.date.split('T')[0]
      if (!dateGroups[date]) {
        dateGroups[date] = []
      }
      dateGroups[date].push(task)
      return dateGroups
    }, {})
    const dateGroupArrays = Object.keys(dateGroups).map((date) => {
      const clientGroups = dateGroups[date].reduce((clientGroups, task) => {
        const clientId = task.client_id
        if (!clientGroups[clientId]) {
          clientGroups[clientId] = []
        }
        clientGroups[clientId].push(task)
        return clientGroups
      }, {})
      const clientArray = Object.keys(clientGroups).map((data) => {
        return {
          uid: uuid(),
          client_id: data,
          client_name: clientGroups[data][0].client_name,
          line: clientGroups[data][0].line,
          tasks: clientGroups[data],
        }
      })
      // dateGroups[date]
      return {
        uid: uuid(),
        date,
        clients: clientArray,
      }
    })
    return { groups: dateGroupArrays, tasks: tdt }
  }
  const formatTodayTasks = (tasks) => {
    const checkIfToday = (d) => {
      const today = DateTime.local()
      const date = DateTime.fromISO(d)
      return date.day == today.day && date.month == today.month && date.year == today.year
    }
    
    const tdt = tasks.filter(
      (b) => b.done === false && checkIfToday(b.date)
    )
    const dateGroups = tdt.reduce((dateGroups, task) => {
      const date = task.date.split('T')[0]
      if (!dateGroups[date]) {
        dateGroups[date] = []
      }
      dateGroups[date].push(task)
      return dateGroups
    }, {})
    const dateGroupArrays = Object.keys(dateGroups).map((date) => {
      const clientGroups = dateGroups[date].reduce((clientGroups, task) => {
        const clientId = task.client_id
        if (!clientGroups[clientId]) {
          clientGroups[clientId] = []
        }
        clientGroups[clientId].push(task)
        return clientGroups
      }, {})
      const clientArray = Object.keys(clientGroups).map((data) => {
        return {
          uid: uuid(),
          client_id: data,
          client_name: clientGroups[data][0].client_name,
          line: clientGroups[data][0].line,
          tasks: clientGroups[data],
        }
      })
      // dateGroups[date]
      return {
        uid: uuid(),
        date,
        clients: clientArray,
      }
    })
    return { groups: dateGroupArrays, tasks: tdt }
  }
  const formatThisWeeksTasks = (tasks) => {
    const today = DateTime.local()
    const tdt = tasks.filter(
      (b) =>
        b.done === false &&
        DateTime.fromISO(b.date, { zone: 'utc' }).hasSame(today, 'week')
    )
    const dateGroups = tdt.reduce((dateGroups, task) => {
      const date = task.date.split('T')[0]
      if (!dateGroups[date]) {
        dateGroups[date] = []
      }
      dateGroups[date].push(task)
      return dateGroups
    }, {})
    const dateGroupArrays = Object.keys(dateGroups).map((date) => {
      const clientGroups = dateGroups[date].reduce((clientGroups, task) => {
        const clientId = task.client_id
        if (!clientGroups[clientId]) {
          clientGroups[clientId] = []
        }
        clientGroups[clientId].push(task)
        return clientGroups
      }, {})
      const clientArray = Object.keys(clientGroups).map((data) => {
        return {
          uid: uuid(),
          client_id: data,
          client_name: clientGroups[data][0].client_name,
          line: clientGroups[data][0].line,
          tasks: clientGroups[data],
        }
      })
      // dateGroups[date]
      return {
        uid: uuid(),
        date,
        clients: clientArray,
      }
    })
    return { groups: dateGroupArrays, tasks: tdt }
  }

  const setTab = (e) => {
    setTodoTab(e)
  }

  return (
    <div
      className={`mt-2 lg:mt-0 flex h-full w-full flex-col rounded-lg`}
    >
      <div className="flex w-full flex-col pl-4 md:flex-row md:items-center md:justify-between">
        <PanelTitle title={`Todos`} color="sky" />
        <TodosNavBar activeItem={todoTab} setTab={(e) => setTab(e)} />
      </div>
      <div className={`flex flex-col rounded-lg px-2`}>
        <div className="relative w-full">
          <Input
            className={`z-10`}
            type="search"
            aria-label="Todo Search Bar"
            size="sm"
            fullWidth
            underlined
            placeholder="Search"
            labelLeft={<FaSearch />}
            onChange={(e) => searchData(e.target.value)}
          />
          <div className="flex search-border-flair pink-to-blue-gradient-1 z-30"/>
        </div>
        <div
          className={`tasks-container flex h-full max-h-[69vh] lg:max-h-[68vh] w-full flex-col space-y-4 overflow-y-auto rounded p-2`}
        >
          {todoTab == 1
            ? data?.map((u) => (
                <motion.div
                  key={u.uid}
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { opacity: 1 },
                    hidden: { opacity: 0 },
                  }}
                  transition={{ ease: 'easeOut', duration: 1 }}
                >
                  <TaskBundleContainer taskBundle={u} />
                </motion.div>
              ))
            : todoTab == 2
            ? overdueTasks?.groups.map((u) => (
                <motion.div
                  key={u.uid}
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { opacity: 1 },
                    hidden: { opacity: 0 },
                  }}
                  transition={{ ease: 'easeOut', duration: 1 }}
                >
                  <TaskBundleContainer taskBundle={u} />
                </motion.div>
              ))
            : todoTab == 3
            ? todaysTasks?.groups.map((u) => (
                <motion.div
                  key={u.uid}
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { opacity: 1 },
                    hidden: { opacity: 0 },
                  }}
                  transition={{ ease: 'easeOut', duration: 1 }}
                >
                  <TaskBundleContainer taskBundle={u} />
                </motion.div>
              ))
            : todoTab == 4
            ? thisWeeksTasks?.groups.map((u) => (
                <motion.div
                  key={u.uid}
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { opacity: 1 },
                    hidden: { opacity: 0 },
                  }}
                  transition={{ ease: 'easeOut', duration: 1 }}
                >
                  <TaskBundleContainer taskBundle={u} />
                </motion.div>
              ))
            : null}
        </div>
      </div>
    </div>
  )
}
