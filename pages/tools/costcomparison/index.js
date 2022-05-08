import { Button, useTheme } from '@nextui-org/react'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import PageHeader from '../../../components/ui/pageheaders/PageHeader'
import PageTitle from '../../../components/ui/pageheaders/PageTitle'
import { useAppContext, useAppHeaderContext } from '../../../context/state'
import AppLayout from '../../../layouts/AppLayout'
import { CgFileDocument } from 'react-icons/cg'
import { AiFillPlusCircle } from 'react-icons/ai'
import ProposalNavbar from '../../../components/ui/navbar/ProposalNavbar'
import CostComparisonContainer from '../../../components/costcomparison/CostComparisonContainer'
import uuid from 'react-uuid'
import { getTemplateId } from '../../../utils/utils'

export default function CostComparison() {
  const router = useRouter()
  const { isDark, type } = useTheme()
  const { state, setState } = useAppContext()
  const [templates, setTemplates] = useState([])
  const { appHeader, setAppHeader } = useAppHeaderContext()

  useEffect(() => {
    setAppHeader({
      ...appHeader,
      titleContent: <PageTitle icon={<CgFileDocument />} text="Cost Comparison Builder" />,
    })
  }, [])

  const dummyTemplate = {
    id: uuid(),
    name: 'Dummy Header',
    headers: [
      {
        id: uuid(),
        title: 'Coverage',
        textBold: false,
        textItalic: false,
        bgColor: null,
        textColor: null,
        default:true,
        editable:true,
      },
      {
        id: uuid(),
        title: 'Current',
        textBold: false,
        textItalic: false,
        bgColor: null,
        textColor: null,
        default:false,
        editable:true,
      },
      {
        id: uuid(),
        title: 'Option 1',
        textBold: false,
        textItalic: false,
        bgColor: null,
        textColor: null,
        default:false,
        editable:true,
      },
    ],
    rows: [],
  }

  const dummyCoverageTemplates = () => {
    const data = [
      {
        id: getTemplateId(),
        header: {
          title: 'Homeowners Policy',
          bgColor: null,
          textColor: null,
          textBold: false,
          textItalic: false,
        },
        rows: [
          {
            id: getTemplateId(),
            isMoney: false,
            textBold: false,
            textItalic: false,
            includeInSum: false,
            defaultBgColor: null,
            defualyTextColor: null,
            columns: [
              {
                id: getTemplateId(),
                data: 'Policy Term',
                bgColor: null,
                textColor: null,
                textBold: false,
                textItalic: false,
                isMoney: false,
              },
              {
                id: getTemplateId(),
                data: '',
                bgColor: null,
                textColor: null,
                textBold: false,
                textItalic: false,
                isMoney: false,
              },
            ],
          },
          {
            id: getTemplateId(),
            isMoney: false,
            textBold: false,
            textItalic: false,
            includeInSum: false,
            defaultBgColor: null,
            defualyTextColor: null,
            columns: [
              {
                id: getTemplateId(),
                data: 'Insurance Carrier',
                bgColor: null,
                textColor: null,
                textBold: false,
                textItalic: false,
                isMoney: false,
              },
              {
                id: getTemplateId(),
                data: '',
                bgColor: null,
                textColor: null,
                textBold: false,
                textItalic: false,
                isMoney: false,
              },
            ],
          },
          {
            id: getTemplateId(),
            isMoney: false,
            textBold: false,
            textItalic: false,
            includeInSum: false,
            defaultBgColor: null,
            defualyTextColor: null,
            columns: [
              {
                id: getTemplateId(),
                data: 'Property Address',
                bgColor: null,
                textColor: null,
                textBold: false,
                textItalic: false,
                isMoney: false,
              },
              {
                id: getTemplateId(),
                data: '',
                bgColor: null,
                textColor: null,
                textBold: false,
                textItalic: false,
                isMoney: false,
              },
            ],
          },
          {
            id: getTemplateId(),
            isMoney: false,
            textBold: false,
            textItalic: false,
            includeInSum: false,
            defaultBgColor: null,
            defualyTextColor: null,
            columns: [
              {
                id: getTemplateId(),
                data: '',
                bgColor: null,
                textColor: null,
                textBold: false,
                textItalic: false,
                isMoney: false,
              },
              {
                id: getTemplateId(),
                data: '',
                bgColor: null,
                textColor: null,
                textBold: false,
                textItalic: false,
                isMoney: false,
              },
            ],
          },
          {
            id: getTemplateId(),
            isMoney: true,
            textBold: false,
            textItalic: false,
            includeInSum: false,
            defaultBgColor: null,
            defualyTextColor: null,
            columns: [
              {
                id: getTemplateId(),
                data: 'Dwelling',
                bgColor: null,
                textColor: null,
                textBold: false,
                textItalic: false,
                isMoney: true,
              },
              {
                id: getTemplateId(),
                data: '',
                bgColor: null,
                textColor: null,
                textBold: false,
                textItalic: false,
                isMoney: true,
              },
            ],
          },
          {
            id: getTemplateId(),
            isMoney: true,
            textBold: false,
            textItalic: false,
            includeInSum: false,
            defaultBgColor: null,
            defualyTextColor: null,
            columns: [
              {
                id: getTemplateId(),
                data: 'Personal Property',
                bgColor: null,
                textColor: null,
                textBold: false,
                textItalic: false,
                isMoney: true,
              },
              {
                id: getTemplateId(),
                data: '',
                bgColor: null,
                textColor: null,
                textBold: false,
                textItalic: false,
                isMoney: true,
              },
            ],
          },
          {
            id: getTemplateId(),
            isMoney: true,
            textBold: false,
            textItalic: false,
            includeInSum: false,
            defaultBgColor: null,
            defualyTextColor: null,
            columns: [
              {
                id: getTemplateId(),
                data: 'Liability Limit - Each Occurrence',
                bgColor: null,
                textColor: null,
                textBold: false,
                textItalic: false,
                isMoney: true,
              },
              {
                id: getTemplateId(),
                data: '',
                bgColor: null,
                textColor: null,
                textBold: false,
                textItalic: false,
                isMoney: true,
              },
            ],
          },
          {
            id: getTemplateId(),
            isMoney: true,
            textBold: false,
            textItalic: false,
            includeInSum: false,
            defaultBgColor: null,
            defualyTextColor: null,
            columns: [
              {
                id: getTemplateId(),
                data: 'Medical Payments - Each Person',
                bgColor: null,
                textColor: null,
                textBold: false,
                textItalic: false,
                isMoney: true,
              },
              {
                id: getTemplateId(),
                data: '',
                bgColor: null,
                textColor: null,
                textBold: false,
                textItalic: false,
                isMoney: true,
              },
            ],
          },
          {
            id: getTemplateId(),
            isMoney: true,
            textBold: false,
            textItalic: false,
            includeInSum: false,
            defaultBgColor: null,
            defualyTextColor: null,
            columns: [
              {
                id: getTemplateId(),
                data: 'Property Loss Deductible*',
                bgColor: null,
                textColor: null,
                textBold: false,
                textItalic: false,
                isMoney: true,
              },
              {
                id: getTemplateId(),
                data: '',
                bgColor: null,
                textColor: null,
                textBold: false,
                textItalic: false,
                isMoney: true,
              },
            ],
          },
          {
            id: getTemplateId(),
            isMoney: true,
            textBold: false,
            textItalic: false,
            includeInSum: false,
            defaultBgColor: null,
            defualyTextColor: null,
            columns: [
              {
                id: getTemplateId(),
                data: 'Premium',
                bgColor: null,
                textColor: null,
                textBold: false,
                textItalic: false,
                isMoney: true,
              },
              {
                id: getTemplateId(),
                data: '',
                bgColor: null,
                textColor: null,
                textBold: false,
                textItalic: false,
                isMoney: true,
              },
            ],
          },
        ],
      },
    ]
    return data
  }

  useEffect(() => {
    setState({
      ...state,
      costComparison: {
        ...state.costComparison,
        builder: { template: dummyTemplate },
      },
    })
    setTemplates(dummyCoverageTemplates())
  }, [])

  const addCoverageTemplate = (tId) => {
    const template = templates.find((x) => x.id === tId)
    const tempId = getTemplateId()
    const newTemplate = {
      ...template,
      id: tempId,
      rows: template.rows.map((r) => {
        return {
          ...r,
          id: getTemplateId(),
          columns: r.columns.map((c) => {
            return { ...c, id: getTemplateId() }
          }),
        }
      }),
    }
    const headerCount = state.costComparison.builder.template.headers.length
    if (newTemplate.rows[0].columns.length < headerCount) {
      state.costComparison.builder.template.headers.forEach((h) => {
        newTemplate.rows.forEach((row) => {
          const basicData = {
            data: '',
            bgColor: row.defaultBgColor,
            textColor: row.defualyTextColor,
            textBold: row.textBold,
            textItalic: row.textItalic,
            isMoney: row.isMoney,
          }
          const newData = { ...basicData, id: getTemplateId() }
          row.columns.push(newData)
        })
      })
    }
    const newRows = [...state.costComparison.builder.template.rows, newTemplate]
    setState({
      ...state,
      costComparison: {
        ...state.costComparison,
        builder: {
          template: { ...state.costComparison.builder.template, rows: newRows },
        },
      },
    })
  }

  return (
    <main className="flex w-full flex-col">
      <ProposalNavbar />
      <div className="flex w-full flex-col pl-4 pr-2 md:flex-row md:space-x-2">
        <div
          className={`flex max-h-[60vh] flex-col overflow-hidden p-2 md:w-[300px] panel-flat-${type} ${type}-shadow rounded-lg`}
        >
          <Button color="gradient" size="sm">
            <AiFillPlusCircle /> NEW
          </Button>
          <div className="flex w-full flex-col">
            <div className="flex items-center justify-center border-b py-4 text-xs">
              <h6>Coverage Templates</h6>
            </div>
            <div className="flex w-full flex-col space-y-2 overflow-y-auto py-2">
              {templates.length < 1 ? (
                <div className="flex items-center justify-center py-4">
                  <h4>No Templates</h4>
                </div>
              ) : (
                templates.map((template) => (
                  <Button
                    key={template.id}
                    flat
                    onClick={() => addCoverageTemplate(template.id)}
                  >
                    {template.header.title}
                  </Button>
                ))
              )}
            </div>
          </div>
          <div className="flex w-full flex-col">
            <div className="flex items-center justify-center border-b py-4 text-xs">
              <h6>Recent Cost Comparisons</h6>
            </div>
            <div className="flex w-full flex-col overflow-y-auto">
              {templates.length < 1 ? (
                <div className="flex items-center justify-center py-4">
                  <h4>None</h4>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div className="hide-scrollbar max-w-[80vw]">
          <CostComparisonContainer />
        </div>
      </div>
    </main>
  )
}

CostComparison.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>
}

// export async function getServerSideProps(context) {
//   const { cid } = context.params
//   const session = await getSession(context)
//   if (session) {
//     const client = await useApi('GET',`/clients/${cid}`,session.accessToken)
//     const events = await useApi('GET',`/events/client/${cid}`,session.accessToken)
//     const emails = await useApi('GET',`/emails/client/${cid}`,session.accessToken)
//     const activity = await useApi('GET',`/activity/client/${cid}`,session.accessToken)

//     return { props: { client, events, emails, activity } }
//   }
//   return { props: { client: null, events: null, emails: null, activity: null } }
// }
