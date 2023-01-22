import Image from 'next/image'
import WebLayout from '../layouts/WebLayout'

export default function Contact() {
  return (
    <main className="flex flex-col w-full h-full pb-20 overflow-y-auto">
      <div className="flex justify-center w-full py-6 text-xl font-bold text-center uppercase tacking-widest">
        WSAPI Setup
      </div>
      <div className="items-center justify-center p-6 text-center">
        <div>You will need to create WSAPI Credentials to pass to BRINQ. </div>
        <div>
          The Web Services API is used to pull agency information, updated
          clients, policies, contacts, and agency employees from your AMS.
        </div>
        <div>
          You will need your Agency Number, WSAPI Username, and WSAPI Password.
        </div>
      </div>
      <div className="relative flex flex-col w-full">
        <ol>
          <li className="flex flex-col">
            <div className="w-full h-full">
              <Image
                showSkeleton
                maxDelay={10000}
                width={250}
                height={120}
                layout="responsive"
                src="https://cdn.brinq.io/assets/WSAPISetup/step1.png"
                alt="LOGO"
              />
            </div>
            <div className="py-6">
              Open the Web Services API Setup: Click -> Administration -> Web
              Service API Setup -> Click New
            </div>
            <div className="w-full h-full">
              <Image
                showSkeleton
                maxDelay={10000}
                width={250}
                height={25}
                layout="responsive"
                src="https://cdn.brinq.io/assets/WSAPISetup/step2.png"
                alt="LOGO"
              />
            </div>
          </li>
          <li className="flex flex-col">
            <div className="py-6">
              <div className="mb-2">
                Use the following information to create the WSAPI login credentials.{' '}
              </div>
              <div>Web Service Application: Custom</div>
              <div>WSAPI Login ID: brinq</div>
              <div className="flex flex-col">
                <div>Password</div>
                <div className="pl-6">
                  <div>Must be at least 6 characters in length</div>
                  <div>Maximum length allowed is 30 characters</div>
                  <div>Passwords are case sensitive</div>
                  <div>Must be alphanumeric characters only</div>
                  <div>Must include at least one numeric character</div>
                  <div>Must include at least one upper-case character</div>
                  <div>Must include at least one lowercase character</div>
                </div>
              </div>
              <div>Data Security Based On: Entity Access Security Only</div>
              <div>Click "Check All" to Enable Full Access</div>
            </div>
            <div className="w-full h-full mb-2">
              <Image
                showSkeleton
                maxDelay={10000}
                width={250}
                height={125}
                layout="responsive"
                src="https://cdn.brinq.io/assets/WSAPISetup/step3.png"
                alt="LOGO"
              />
            </div>
            <div className="w-full h-full">
              <Image
                showSkeleton
                maxDelay={10000}
                width={250}
                height={25}
                layout="responsive"
                src="https://cdn.brinq.io/assets/WSAPISetup/step4.png"
                alt="LOGO"
              />
            </div>
            <div className="py-6">
              <div>Click Add -> Click Save and Close</div>
            </div>
          </li>
          <li className="flex flex-col">
            <div className="py-6">
              <div>To find your Agency Number follow these instructions.</div>
              <div className="py-6">
                Click -> Administration -> Agency Overview -> Click Edit Agency
              </div>
            </div>
            <div className="w-full h-full mb-2">
              <Image
                showSkeleton
                maxDelay={10000}
                width={250}
                height={50}
                layout="responsive"
                src="https://cdn.brinq.io/assets/WSAPISetup/step5.png"
                alt="LOGO"
              />
            </div>
            <div className="w-full h-full">
              <Image
                showSkeleton
                maxDelay={10000}
                width={250}
                height={32}
                layout="responsive"
                src="https://cdn.brinq.io/assets/WSAPISetup/step6.png"
                alt="LOGO"
              />
            </div>
          </li>
          <li className="flex flex-col">
            <div className="py-6">
              You should now have the your agency's WSAPI credentials to pass to
              BRINQ.
            </div>
          </li>
        </ol>
      </div>
    </main>
  )
}

Contact.getLayout = function getLayout(page) {
  return <WebLayout>{page}</WebLayout>
}
