import { Button, Loading } from '@nextui-org/react'
import React, { useState } from 'react'
import { useNextApi } from '../../../utils/utils'
import PanelTitle from '../../ui/title/PanelTitle'

function AgencyActions() {
  const [loading, setLoading] = useState(false)

  const updateActions = async () => {
    setLoading(true)
    const res = await useNextApi('GET', `/api/utils/update-actions`)
    if (res) {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col w-full">
      <PanelTitle title="Actions" color="indigo" />
      <div className="flex w-full">
        <Button auto flat onClick={updateActions} disabled={loading}>
          {loading ? (
            <Loading type="points-opacity" color="currentColor" size="md" />
          ) : (
            <div>Update Activity Actions and Doc Types</div>
          )}
        </Button>
      </div>
    </div>
  )
}

export default AgencyActions
