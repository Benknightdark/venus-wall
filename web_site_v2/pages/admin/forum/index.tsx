import { ReactElement } from "react";
import useSWR from "swr";
import { adminGlobalStore, defaultAdminGlobalStoreData } from "../../../stores/admon-global-store";
import AdminLayout from "../../utils/admin-layout";

const Index = () => {
    const { data: adminGlobalStoreData, mutate: adminGlobalStoreMutate } = useSWR(adminGlobalStore,
        { fallbackData: defaultAdminGlobalStoreData })
    adminGlobalStoreMutate({ ...defaultAdminGlobalStoreData, pageTitle: '論壇管理', pageDescription: '管理要爬的論壇網站' }, false)
    return (
        <div className="overflow-x-auto ">
            <table className="table w-full ">
                <thead className=''>
                    <tr>
                        <th className='bg-green-200'></th>
                        <th className='bg-green-200'>Name</th>
                        <th className='bg-green-200'>Job</th>
                        <th className='bg-green-200'>Favorite Color</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="hover">
                        <th>1</th>
                        <td>Cy Ganderton</td>
                        <td>Quality Control Specialist</td>
                        <td>Blue</td>
                    </tr>
                    <tr className="hover">
                        <th>2</th>
                        <td>Hart Hagerty</td>
                        <td>Desktop Support Technician</td>
                        <td>Purple</td>
                    </tr>
                    <tr className="hover">
                        <th>3</th>
                        <td>Brice Swyre</td>
                        <td>Tax Accountant</td>
                        <td>Red</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
Index.getLayout = function getLayout(page: ReactElement) {
    return (
        <AdminLayout>
            {page}
        </AdminLayout>
    )
}
export default Index;