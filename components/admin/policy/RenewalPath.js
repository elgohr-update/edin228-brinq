import { Button, Switch, useTheme } from '@nextui-org/react'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { getIcon, sortByProperty, useNextApi } from '../../../utils/utils'
import BrinqInput from '../../ui/input/BrinqInput'
import RenewalPathCard from './RenewalPathCard'

function RenewalPath({ path, allPaths = [] }) {
  const { type } = useTheme()
  const [pathData, setPathData] = useState(null)
  const [editName, setEditName] = useState(path.title)
  const [showEditName, setShowEditName] = useState(false)
  const [showInactive, setShowInactive] = useState(false)

  useEffect(() => {
    setPathData(path)
    return () => {}
  }, [path])

  const filteredPath = () =>
    pathData && showInactive
      ? pathData?.base_tasks
      : pathData?.base_tasks.filter((x) => x.archived != true)

  const changePath = (e, field) => {
    const newPath = { ...pathData }
    newPath[field] = e
    setPathData({
      ...newPath,
    })
  }

  const cancelEditName = () => {
    setEditName(path.title)
    setShowEditName(false)
  }

  const changeDefault = async (e) => {
    if (allPaths.length > 1) {
      changePath(e, 'default_template')
      const bundle = {
        title: editName,
        default_template: e,
      }
      const res = await useNextApi(
        'PUT',
        `/api/paths/${path.id}`,
        JSON.stringify(bundle)
      )
      if (res) {
        setShowEditName(false)
      }
    }
  }

  const submitNewName = async () => {
    const bundle = {
      title: editName,
      default_template: pathData.default_template,
    }
    const res = await useNextApi(
      'PUT',
      `/api/paths/${path.id}`,
      JSON.stringify(bundle)
    )
    if (res) {
      setShowEditName(false)
    }
  }

  return (
    <div className={`flex flex-col rounded-2xl p-4 panel-theme-${type} ${type}-shadow`}>
      <div className="flex items-center w-full gap-4">
        <div className="flex min-w-[200px] items-center pl-2">
          {!showEditName ? (
            <>
              <h6 className="flex items-center">{editName}</h6>
              <Button
                light
                size="xs"
                auto
                onClick={() => setShowEditName(!showEditName)}
              >
                <div className="flex items-center">{getIcon('edit')}</div>
              </Button>
            </>
          ) : (
            <>
              <BrinqInput
                color="lime"
                placeholder="Change Renewal Path Name"
                callBack={(e) => setEditName(e)}
                inputType="text"
                underlined={false}
                value={editName}
                initialValue={editName}
                borderd={true}
                disabled={false}
                clearable={false}
              />
              <Button
                light
                size="xs"
                color="success"
                auto
                onClick={() => submitNewName()}
              >
                <div className="flex items-center">
                  {getIcon('circleCheck')}
                </div>
              </Button>
              <Button
                light
                color="error"
                size="xs"
                auto
                onClick={() => cancelEditName()}
              >
                <div className="flex items-center">{getIcon('circleX')}</div>
              </Button>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-end justify-end">
            <h4>Default Path</h4>
            <Switch
              checked={pathData?.default_template}
              size="xs"
              disabled={allPaths.length <= 1}
              onChange={(e) =>
                allPaths.length > 1 ? changeDefault(e.target.checked) : null
              }
            />
          </div>
          <div className="flex flex-col items-end justify-end">
            <h4>Show Inactive</h4>
            <Switch
              checked={showInactive}
              size="xs"
              onChange={(e) => setShowInactive(e.target.checked)}
            />
          </div>
        </div>
      </div>
      <div className="flex w-full max-w-[86vw] gap-4 overflow-x-auto px-2 py-4 xl:max-w-[93vw]">
        {sortByProperty(filteredPath(), 'daysDue', false).map((task, indx) => (
          <RenewalPathCard key={task.id} indx={indx} path={path} task={task} />
        ))}
      </div>
    </div>
  )
}

export default RenewalPath
