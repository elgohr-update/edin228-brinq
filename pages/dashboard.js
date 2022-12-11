import AppLayout from '../layouts/AppLayout'
import DashboardDesktop from '../components/dashboard/DashboardDesktop'
import DashboardMobile from '../components/dashboard/DashboardMobile';
import { isMobile } from '../utils/utils';

export default function Dashboard() {
  const mobile =  isMobile();
  return (
    mobile ? <DashboardMobile /> : <DashboardDesktop />
    
  )
}

Dashboard.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>
}
