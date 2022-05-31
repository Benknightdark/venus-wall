import { ReactElement } from "react";
import AdminLayout from '../utils/admin-layout';

const Index = () => {
    return (
        <div>
            Enter
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