"use client";
import Section from "@/pages/component/Section";
import DashbaordLayout from "@/pages/layout/dashboard/DasboardLayout";
import React, { useEffect, useRef, useState } from "react";
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

  //   Modal - WIP
  const [modalAdd, setModalAdd] = useState<boolean>(true);
  function showModalAdd() {
    setModalAdd(true);
  }
  //   END Modal

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
  }, [offset, closeLoading, searchMode, refresh]);

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

  return (
    <DashbaordLayout pageTitle="User Management" role="admin">
      <Section
        header="Daftar seluruh user"
        cta={[{ type: "primary", text: "Tambah User", onClick: showModalAdd }]}
      >
        {/* Search bar */}
        <div className={s.search}>
          <input
            type="text"
            placeholder="Cari berdasarkan userNama, email, role"
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
                      <Button>Detail</Button> <Button>Edit</Button>
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
          close={() => setModalAdd(false)}
          submit={() => setModalAdd(false)}
        >
          Ahay
          {/* TODO: Fitur tambah user by admin */}
        </Modal>
      )}
    </DashbaordLayout>
  );
}

export default UserManagement;
