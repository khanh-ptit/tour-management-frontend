import { useEffect, useState } from "react";
import {
  editPermission,
  getRoleList,
} from "../../../services/admin/role.service";
import { Checkbox, Button, message, Spin } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function PermissionPage() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState({});
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const { permissions: permissionsReducers } = useSelector(
    (state) => state.roleReducer
  );

  const modules = {
    "tour-categories": ["view", "create", "edit", "delete"],
    tours: ["view", "create", "edit", "delete"],
    destinations: ["view", "create", "edit", "delete"],
    orders: ["view", "edit", "delete"],
    services: ["view", "create", "edit", "delete"],
    accounts: ["view", "create", "edit", "delete"],
    users: ["view", "edit", "delete"],
    roles: ["view", "create", "edit", "delete", "permissions"],
    chat: ["chat"],
  };

  const moduleTitleMap = {
    "tour-categories": "Danh mục tour",
    tours: "Quản lý tour",
    roles: "Quản lý nhóm quyền",
    destinations: "Quản lý điểm du lịch",
    orders: "Quản lý đơn hàng",
    services: "Quản lý dịch vụ",
    accounts: "Tài khoản admin",
    users: "Tài khoản client",
    chat: "Chăm sóc khách hàng",
  };

  const actionTitleMap = {
    view: "Xem",
    edit: "Chỉnh sửa",
    create: "Tạo mới",
    delete: "Xóa",
    permissions: "Phân quyền",
    chat: "Chat",
  };

  useEffect(() => {
    if (!permissionsReducers.includes("roles_permissions")) {
      navigate("/admin/error/403");
      return;
    }
    document.title = "Phân quyền | Admin";
    const fetchRoles = async () => {
      const response = await getRoleList();
      if (response.code === 200) {
        setRoles(response.roles);

        const perms = {};
        response.roles.forEach((role) => {
          perms[role._id] = role.permissions || [];
        });
        setPermissions(perms);
      } else {
        messageApi.error(response.message);
      }
    };
    fetchRoles();
  }, []);

  // Toggle checkbox
  const handleCheckboxChange = (roleId, permission) => {
    setPermissions((prev) => {
      const rolePerms = new Set(prev[roleId] || []);
      if (rolePerms.has(permission)) {
        rolePerms.delete(permission);
      } else {
        rolePerms.add(permission);
      }
      return { ...prev, [roleId]: Array.from(rolePerms) };
    });
  };

  const handleSubmit = async () => {
    const permissionResponse = await editPermission(permissions);
    if (permissionResponse.code === 200) {
      setRoles(permissionResponse.roles);

      const perms = {};
      permissionResponse.roles.forEach((role) => {
        perms[role._id] = role.permissions || [];
      });
      setPermissions(perms);

      messageApi.open({
        type: "success",
        content: permissionResponse.message || "Đã cập nhật phân quyền",
      });
    } else {
      messageApi.open({
        type: "error",
        content:
          permissionResponse.message || "Xảy ra lỗi khi cập nhật phân quyền",
      });
    }
  };

  return (
    <>
      {contextHolder}
      <>
        <div className="d-flex justify-content-end mb-4">
          <Button
            icon={<CheckOutlined />}
            type="primary"
            onClick={handleSubmit}
          >
            Cập nhật
          </Button>
        </div>

        <Spin spinning={roles.length === 0} tip="Đang tải dữ liệu...">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th style={{ backgroundColor: "#5398FA", color: "white" }}>
                  Tính năng
                </th>
                {roles.map((role) => (
                  <th
                    key={role._id}
                    style={{ backgroundColor: "#5398FA", color: "white" }}
                    className="text-center"
                  >
                    {role.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(modules).map(([module, actions]) => (
                <>
                  <tr key={module} className="table-secondary">
                    <td
                      style={{
                        backgroundColor: "#eee",
                        color: "#000",
                        border: "1px solid #ddd",
                      }}
                      colSpan={roles.length + 1}
                    >
                      <b>{moduleTitleMap[module]}</b>
                    </td>
                  </tr>
                  {actions.map((action) => {
                    const permKey = `${module}_${action}`;
                    return (
                      <tr key={permKey}>
                        <td>{actionTitleMap[action]}</td>
                        {roles.map((role) => (
                          <td key={role._id} className="text-center">
                            <Checkbox
                              checked={permissions[role._id]?.includes(permKey)}
                              onChange={() =>
                                handleCheckboxChange(role._id, permKey)
                              }
                            />
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </>
              ))}
            </tbody>
          </table>
        </Spin>
      </>
    </>
  );
}

export default PermissionPage;
