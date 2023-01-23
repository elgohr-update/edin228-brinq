import AppLayout from '../layouts/AppLayout'
import DashboardDesktop from '../components/dashboard/DashboardDesktop'
import DashboardMobile from '../components/dashboard/DashboardMobile';
import { isLaptop, isMobile } from '../utils/utils';
import DashboardLaptop from '../components/dashboard/DashboardLaptop';

export default function Dashboard() {
  const mobile =  isMobile();
  const laptop = isLaptop()
  return (
    mobile ? <DashboardMobile /> : laptop ? <DashboardLaptop /> : <DashboardDesktop />
    
  )
}

Dashboard.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>
}
