"use client";
import Section from "@/pages/component/Section";
import DashboardLayout from "@/pages/layout/dashboard/DashboardLayout";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import s from "./index.module.scss";
import Button from "@/pages/component/Button";
import { User } from "@/types";
import { userServices } from "@/services/user";
import { useLoading } from "@/hooks/useLoading";
import Modal from "@/pages/component/Modal";

function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [dbPage, setDbPage] = useState(1);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [searchMode, setSearchMode] = useState<boolean>(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const [searchDisabled, setSearchDisabled] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const { showLoading, closeLoading } = useLoading();

  // first-time fetch users data
  useEffect(() => {
    try {
      showLoading();
      async function getUsers() {
        const users = await userServices.getAll(offset);
        if (users && users.data) {
          setUsers(users.data);
          return closeLoading();
        } else {
          return closeLoading();
        }
      }
      async function searchUser() {
        const prompt = searchRef.current?.value;
        if (prompt?.length) {
          const users = await userServices.searchUser(prompt as string, offset);
          if (users && users.data) {
            setUsers(users.data);
            return closeLoading();
          } else {
            return closeLoading();
          }
        } else {
          setSearchMode(false);
        }
      }
      if (searchMode) {
        searchUser();
      } else {
        getUsers();
      }
    } catch {
      console.log("Something error: cant get data from db");
    }
  }, [offset, closeLoading, searchMode, refresh, showLoading]);

  // Reset pagination saat berganti mode
  useEffect(() => {
    setOffset(0);
  }, [searchMode]);

  // menambahkan offset untuk pagination
  useEffect(() => {
    setOffset((dbPage - 1) * 10);
  }, [dbPage]);

  function nextDbPage() {
    if (users.length === 10) {
      setDbPage(dbPage + 1);
      setDisabled(true);
    }
  }

  function prevDbPage() {
    if (dbPage > 1) {
      setDbPage(dbPage - 1);
      setDisabled(true);
    }
  }

  // auto disable-enable tombol
  useEffect(() => {
    const timer = setTimeout(() => {
      setDisabled(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [disabled]);

  // Berganti mode dari get all menjadi search
  function searchUser() {
    const value = searchRef.current?.value;
    if (value?.length) {
      setSearchMode(true);
      setOffset(0);
      setRefresh(!refresh);
    }
  }

  function searchInputOnChange() {
    if (searchRef.current?.value?.length) {
      setSearchDisabled(false);
    } else {
      setSearchDisabled(true);
    }
  }

  function refreshData() {
    setRefresh(!refresh);
    setSearchMode(false);
    if (searchRef.current) {
      searchRef.current.value = "";
    }
  }

  // Modal: Add user
  const [modalAdd, setModalAdd] = useState<boolean>(false);
  function showModalAdd() {
    setModalAdd(true);
  }
  const [formData, setFormData] = useState({
    userid: "",
    password: "",
    nama: "",
    role: "",
  });

  const [alertModalAdd, setAlertModalAdd] = useState("");

  // Fungsi untuk menangani perubahan input
  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    if (
      formData.userid &&
      formData.password &&
      formData.nama &&
      formData.role
    ) {
      try {
        showLoading();
        const create = await userServices.createUser(formData as User);
        if (create.status === 200) {
          setAlertModalAdd("Success: " + formData.userid + " created");
          setRefresh(!refresh);
          formData.userid = "";
          formData.password = "";
          formData.nama = "";
          formData.role = "";
        } else {
          setAlertModalAdd("Failed: " + create.data.message);
        }
      } catch (err) {
        console.log(err);
        setAlertModalAdd("Failed");
      } finally {
        closeLoading();
      }
    } else {
      setAlertModalAdd("Failed: Input tidak lengkap");
    }
  };

  // Modal: Detail user
  const [modalDetail, setModalDetail] = useState<boolean>(false);

  const [detailUser, setDetailUser] = useState<User | null>(null);
  function showModalDetail(user: User) {
    setDetailUser(user);
    setModalDetail(true);
  }
  function closeModalDetail() {
    setModalDetail(false);
  }

  // Modal: Edit user
  const [modalEdit, setModalEdit] = useState<boolean>(false);
  const [alertModalEdit, setAlertModalEdit] = useState<string>("");
  const [editUser, setEditUser] = useState<User | null>(null);

  const [editFormData, setEditFormData] = useState({} as User);
  async function showModalEdit(user: User) {
    setEditUser(user);
    setModalEdit(true);
    setEditFormData((prev) => ({ ...prev, userid: user.userid }));
  }
  function closeModalEdit() {
    setModalEdit(false);
  }

  const handleChangeEdit = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value }: { name: string; value: string } = e.target;

    if (editFormData) {
      const copy: User = { ...editFormData };
      copy[name] = value;
      setEditFormData(copy);
    }
  };

  async function handleEdit() {
    try {
      showLoading();
      const isInputValid = Object.keys(editFormData).length > 1;
      if (isInputValid) {
        setAlertModalEdit("");
        const res = await userServices.updateUser(editFormData);
        if (res.status === 200) {
          setAlertModalEdit("Success: " + editFormData.userid + " updated");
          setRefresh(!refresh);
        } else {
          setAlertModalEdit("Failed: " + res.data.message);
        }
      } else {
        setAlertModalEdit("Tidak ada data yang diubah");
      }
    } catch (err) {
      console.log(err);
    } finally {
      closeLoading();
    }
  }

  // Modal: delete user
  const [modalDelete, setModalDelete] = useState<boolean>(false);
  const [deleteUserid, setDeleteUserid] = useState("");
  function showModalDelete(userid: string) {
    setDeleteUserid(userid);
    setModalDelete(true);
  }
  function closeModalDelete() {
    setModalDelete(false);
  }

  async function handleDelete() {
    try {
      showLoading();
      await userServices.deleteUser(deleteUserid);
      setDeleteUserid("");
      setRefresh(!refresh);
      setModalDelete(false);
    } catch (err) {
      console.log(err);
    } finally {
      closeLoading();
    }
  }

  // Modal prevent body scroll
  useEffect(() => {
    if (modalDetail || modalAdd) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [modalDetail, modalAdd]);
  return (
    <DashboardLayout pageTitle="User Management" role="admin">
      <Section
        header="Daftar seluruh user"
        cta={[{ type: "primary", text: "Tambah User", onClick: showModalAdd }]}
      >
        {/* Search bar */}
        <div className={s.search}>
          <input
            type="text"
            placeholder="Cari berdasarkan userid, nama, atau email"
            ref={searchRef}
            onChange={searchInputOnChange}
          />
          <Button onClick={searchUser} disabled={searchDisabled}>
            Search
          </Button>
          <Button onClick={refreshData} className={s.search__refresh}>
            <i className="bx bx-refresh"></i>
          </Button>
        </div>

        {/* Table */}
        <table className={s.table}>
          <thead>
            <tr>
              <th>No</th>
              <th>Userid</th>
              <th>Nama</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length ? (
              users.map((user, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1 + (dbPage - 1) * 10}</td>
                    <td>{user.userid}</td>
                    <td>{user.nama}</td>
                    <td>{user.role}</td>
                    <td>
                      <Button onClick={() => showModalDetail(user)}>
                        Detail
                      </Button>
                      <Button onClick={() => showModalEdit(user)}>Edit</Button>
                      <Button
                        type="delete"
                        onClick={() => showModalDelete(user.userid as string)}
                      >
                        Hapus
                      </Button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5}>No data</td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={5} align="left">
                <Button onClick={prevDbPage} disabled={disabled}>
                  Prev
                </Button>
                <Button onClick={nextDbPage} disabled={disabled}>
                  Next
                </Button>
              </td>
            </tr>
          </tfoot>
        </table>
      </Section>

      {/* Modal: Add user */}
      {modalAdd && (
        <Modal
          title="Buat akun baru"
          type="prompt"
          close={() => setModalAdd(false)}
          submit={() => handleSubmit()}
        >
          <form onSubmit={handleSubmit} className={s.modal}>
            <div className={s.modal__input}>
              <label htmlFor="userid">User ID</label>
              <input
                type="text"
                name="userid"
                placeholder="User ID"
                value={formData.userid}
                onChange={handleChange}
              />
            </div>

            <div className={s.modal__input}>
              <label htmlFor="password">Password</label>
              <input
                type="text"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className={s.modal__input}>
              <label htmlFor="nama">Nama Lengkap</label>
              <input
                type="text"
                name="nama"
                placeholder="Nama Lengkap"
                value={formData.nama}
                onChange={handleChange}
              />
            </div>

            <div className={s.modal__input}>
              <label htmlFor="role">Role</label>
              <select
                name="role"
                id="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="" disabled hidden>
                  -- Pilih role --
                </option>
                <option value="user">User</option>
                <option value="purchasing">Purchasing</option>
                <option value="supervisor">Supervisor</option>
                <option value="manager">Manager</option>
                <option value="director">Director</option>
                <option value="finance">Finance</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {alertModalAdd && (
              <div className={s.modal__alert}>
                {alertModalAdd}{" "}
                <span onClick={() => setAlertModalAdd("")}>X</span>
              </div>
            )}
          </form>
        </Modal>
      )}

      {/* Modal detail user */}
      {modalDetail && (
        <Modal title="Detail user" type="information" close={closeModalDetail}>
          <div className={s.detail__field}>
            <span>User ID</span>
            {detailUser?.userid}
          </div>
          <div className={s.detail__field}>
            <span>Nama</span>
            {detailUser?.nama}
          </div>
          <div className={s.detail__field}>
            <span>Email</span>
            {detailUser?.email}
          </div>
          <div className={s.detail__field}>
            <span>Role</span>
            {detailUser?.role}
          </div>
          <div className={s.detail__field}>
            <span>Tanggal pembuatan</span>
            {new Date(detailUser?.date_created as string).toLocaleString(
              "id-ID",
              {
                day: "numeric",
                month: "long",
                year: "numeric",
              }
            )}
          </div>
          {/* {alertModalDetail && (
            <div className={s.modal__alert}>
              {alertModalDetail}
              <span onClick={() => setAlertModalDetail("")}>X</span>
            </div>
          )} */}
        </Modal>
      )}

      {/* Modal edit user */}
      {modalEdit && (
        <Modal
          title="Edit informasi akun"
          type="prompt"
          close={closeModalEdit}
          submit={handleEdit}
        >
          <form onSubmit={handleEdit} className={s.modal}>
            <div className={s.modal__input}>
              <label htmlFor="userid">User ID</label>
              <input
                type="text"
                name="userid"
                placeholder="User ID"
                defaultValue={editUser?.userid}
                onChange={handleChangeEdit}
              />
            </div>

            <div className={s.modal__input}>
              <label htmlFor="password">Password baru</label>
              <input
                type="text"
                name="password"
                placeholder="Password"
                onChange={handleChangeEdit}
              />
            </div>

            <div className={s.modal__input}>
              <label htmlFor="nama">Nama Lengkap</label>
              <input
                type="text"
                name="nama"
                placeholder="Nama Lengkap"
                defaultValue={editUser?.nama}
                onChange={handleChangeEdit}
              />
            </div>

            <div className={s.modal__input}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Nomor telepon"
                defaultValue={editUser?.email}
                onChange={handleChangeEdit}
              />
            </div>

            <div className={s.modal__input}>
              <label htmlFor="phone">Nomor telepon</label>
              <input
                type="text"
                name="phone"
                placeholder="Nomor telepon"
                defaultValue={editUser?.phone}
                onChange={handleChangeEdit}
              />
            </div>

            <div className={s.modal__input}>
              <label htmlFor="role">Role</label>
              <select
                name="role"
                id="role"
                defaultValue={editUser?.role}
                onChange={handleChangeEdit}
              >
                <option value="" disabled hidden>
                  -- Pilih role --
                </option>
                <option value="user">User</option>
                <option value="purchasing">Purchasing</option>
                <option value="supervisor">Supervisor</option>
                <option value="manager">Manager</option>
                <option value="director">Director</option>
                <option value="finance">Finance</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {alertModalEdit && (
              <div className={s.modal__alert}>
                {alertModalEdit}{" "}
                <span onClick={() => setAlertModalEdit("")}>X</span>
              </div>
            )}
          </form>
        </Modal>
      )}

      {/* Modal delete user */}
      {modalDelete && (
        <Modal close={closeModalDelete} type="prompt" submit={handleDelete}>
          <div className={s.modal__alert}>
            Yakin ingin menghapus akun dengan userid {`"${deleteUserid}"`}?
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
}

export default UserManagement;
