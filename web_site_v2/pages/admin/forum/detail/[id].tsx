import { useRouter } from "next/router";
import { ReactElement } from "react";
import AdminLayout from "../../../utils/admin-layout";

const Detail = () => {
    const router=useRouter();
    const { id } = router.query

    return (
        <div>
            {id}
        </div>
    );
}
Detail.getLayout = function getLayout(page: ReactElement) {
    return (
        <AdminLayout>
            {page}
        </AdminLayout>
    )
}
export default Detail;