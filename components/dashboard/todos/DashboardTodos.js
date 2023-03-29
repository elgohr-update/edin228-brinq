import React, { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { Input, Loading, Switch, useTheme } from '@nextui-org/react'
import PanelTitle from '../../ui/title/PanelTitle'
import { getSearch, isMobile, timeout, useNextApi } from '../../../utils/utils'
import TaskBundleContainer from '../../task/taskbundle/TaskBundleContainer'
import uuid from 'react-uuid'
import { DateTime } from 'luxon'
import TodosNavBar from './TodosNavBar'
import { motion } from 'framer-motion'
import {
  UpdateDataWrapper,
  useReloadContext,
  useUpdateDataContext,
} from '../../../context/state'

export default function DashboardTodos({ data = [] }) {
  const { updateData, setUpdateData } = useUpdateDataContext()
  const [todaysTasks, setTodaysTasks] = useState(null)
  const [thisWeeksTasks, setThisWeeksTasks] = useState(null)
  const [overdueTasks, setOverdueTasks] = useState(null)
  const [todoTab, setTodoTab] = useState(3)
  const [raw, setRaw] = useState([])
  const [rawNoFormat, setRawNoFormat] = useState(null)
  const [showCompleted, setShowCompleted] = useState(false)
  const [loading, setLoading] = useState(true)
  const { reload, setReload } = useReloadContext()
  const { type } = useTheme()
  const mobile = isMobile()

  useEffect(() => {
    let isCancelled = false
    const handleChange = async () => {
      if (!isCancelled) {
        formatTasks(data)
      }
    }
    handleChange()
    return () => {
      isCancelled = true
    }
  }, [data])

  useEffect(() => {
    const handleChange = async () => {
      await timeout(100)
      fetchTasks()
      setReload({
        ...reload,
        policies: false,
      })
    }
    if (reload.policies) {
      handleChange()
    }
    return () => {}
  }, [reload])

  // useEffect(() => {
  //   const handleChange = async () => {
  //     await timeout(100)
  //     if (updateData.task){
  //       const dueDate = DateTime.fromISO(updateData.task.date).toSQLDate(DateTime.DATE_SHORT)
  //       const clientId = updateData.task.client_id

  //       const newRaw = [...raw]
  //       const newOverdueTasks = {...overdueTasks}
  //       const newThisWeeksTasks = {...thisWeeksTasks}
  //       const newTodaysTasks = {...todaysTasks}

  //       const foundRawGroup = newRaw.find( x => x.date == dueDate)?.clients
  //       const foundOverDueGroup = newOverdueTasks?.groups?.find( x => x.date == dueDate)?.clients
  //       const foundWeekGroup = newThisWeeksTasks?.groups?.find( x => x.date == dueDate)?.clients
  //       const foundTodayGroup = newTodaysTasks?.groups?.find( x => x.date == dueDate)?.clients

  //       if (foundRawGroup){
  //         const client1 = foundRawGroup.find( x => x.client_id == clientId)
  //         const taskIndex1 = client1?.tasks.findIndex( x => x.id == updateData.task.id)
  //         client1?.tasks[taskIndex1] = updateData.task
  //         setRaw(newRaw)
  //       }
  //       if (foundOverDueGroup){
  //         const client2 = foundOverDueGroup.find( x => x.client_id == clientId)
  //         const taskIndex2 = client2?.tasks.findIndex( x => x.id == updateData.task.id)
  //         client2?.tasks[taskIndex2] = updateData.task
  //         setOverdueTasks(newOverdueTasks)
  //       }
  //       if (foundTodayGroup){
  //         const client4 = foundTodayGroup.find( x => x.client_id == clientId)
  //         const taskIndex4 = client4?.tasks.findIndex( x => x.id == updateData.task.id)
  //         client4?.tasks[taskIndex4] = updateData.task
  //         setTodaysTasks(newTodaysTasks)
  //       }
  //       if (foundWeekGroup){
  //         const client3 = foundWeekGroup.find( x => x.client_id == clientId)
  //         const taskIndex3 = client3?.tasks.findIndex( x => x.id == updateData.task.id)
  //         client3?.tasks[taskIndex3] = updateData.task
  //         setThisWeeksTasks(newThisWeeksTasks)
  //       }

  //     }
  //   }
  //   handleChange()
  //   return () => {}
  // }, [updateData.task])

  const fetchTasks = async () => {
    setLoading(true)
    const res = await useNextApi('GET', `/api/tasks/`)
    if (res){
      formatTasks(res)
      setLoading(false)
    }
  }

  const toggleCompleted = (e) => {
    setShowCompleted(e)
    formatTasks(rawNoFormat)
  }

  const formatTasks = (d) => {
    const format = bundleTasks(d)
    const overDue = formatOverdueTasks(d)
    const todays = formatTodayTasks(d)
    const weeks = formatThisWeeksTasks(d)
    setRawNoFormat(d)
    setRaw(format)
    setOverdueTasks(overDue)
    setThisWeeksTasks(weeks)
    setTodaysTasks(todays)
    if (todays?.groups?.length < 1) {
      setTodoTab(4)
    }
    if (weeks?.groups?.length < 1) {
      setTodoTab(1)
    }
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

  const bundleTasks = (tasks = null) => {
    if (tasks) {
      let tdt
      if (showCompleted) {
        tdt = tasks
      } else {
        tdt = tasks?.filter((b) => b.done === false)
      }
      const dateGroups = tdt?.reduce((dateGroups, task) => {
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
      setLoading(false)
      return dateGroupArrays
    }
  }
  const formatOverdueTasks = (tasks = null) => {
    if (tasks) {
      const today = new Date()
      let tdt
      if (showCompleted) {
        tdt = tasks.filter((b) => new Date(b.date) < today)
      } else {
        tdt = tasks.filter((b) => b.done === false && new Date(b.date) < today)
      }
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
  }
  const formatTodayTasks = (tasks = null) => {
    if (tasks) {
      const checkIfToday = (d) => {
        const today = DateTime.local()
        const date = DateTime.fromISO(d)
        return (
          date.day == today.day &&
          date.month == today.month &&
          date.year == today.year
        )
      }
      let tdt
      if (showCompleted) {
        tdt = tasks.filter((b) => checkIfToday(b.date))
      } else {
        tdt = tasks.filter((b) => b.done === false && checkIfToday(b.date))
      }

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
  }
  const formatThisWeeksTasks = (tasks = null) => {
    if (tasks) {
      const today = DateTime.local()
      let tdt
      if (showCompleted) {
        tdt = tasks.filter((b) =>
          DateTime.fromISO(b.date, { zone: 'utc' }).hasSame(today, 'week')
        )
      } else {
        tdt = tasks.filter(
          (b) =>
            b.done == false &&
            DateTime.fromISO(b.date, { zone: 'utc' }).hasSame(today, 'week')
        )
      }
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
  }
  const setTab = (e) => {
    setTodoTab(e)
  }

  return (
    <div
      className={`mt-2 flex h-full w-full flex-auto shrink-0 flex-col rounded-lg xl:mt-0`}
    >
      <div className="flex flex-col w-full xl:flex-row xl:items-center xl:justify-between xl:pl-4">
        {!mobile ? <PanelTitle title={`Todos`} color="sky" /> : null}
        <TodosNavBar activeItem={todoTab} setTab={(e) => setTab(e)} />
      </div>
      <div
        className={`flex h-full flex-col rounded-lg panel-theme-${type} ${type}-shadow`}
      >
        <div className="relative w-full">
          <div className="flex items-center w-full ">
            <div className="w-full">
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
              <div className="z-30 flex w-full search-border-flair pink-to-blue-gradient-1" />
            </div>
            <div className="relative flex items-center justify-end pr-2">
              <h4 className="mr-2 text-xs">Completed</h4>
              <Switch
                checked={showCompleted}
                size="xs"
                onChange={(e) => toggleCompleted(e.target.checked)}
              />
            </div>
          </div>
        </div>
        <div
          className={`tasks-container flex h-full w-full flex-col space-y-4 overflow-y-auto overflow-x-hidden rounded p-2 xl:max-h-[84vh]`}
        >
          {loading ? (
            <div className="flex items-center justify-center w-full h-full">
              <Loading type="points-opacity" color="currentColor" size="md" />
            </div>
          ) : todoTab == 1 ? (
            raw?.map((u) => (
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
          ) : todoTab == 2 ? (
            overdueTasks?.groups?.map((u) => (
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
          ) : todoTab == 3 ? (
            todaysTasks?.groups?.map((u) => (
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
          ) : todoTab == 4 ? (
            thisWeeksTasks?.groups?.map((u) => (
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
          ) : null}
        </div>
      </div>
    </div>
  )
}
