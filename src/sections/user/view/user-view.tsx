/* eslint-disable */
import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { ToastContainer, toast, Flip } from 'react-toastify';

import { _users } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { UserTableToolbar } from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

import type { UserProps } from '../user-table-row';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBQ0ZUNHndALONm9lme_DgpYPyOW5-uRWM",
  authDomain: "react-214a7.firebaseapp.com",
  projectId: "react-214a7",
  storageBucket: "react-214a7.firebasestorage.app",
  messagingSenderId: "743977768167",
  appId: "1:743977768167:web:afab4fc61e3d1a455d7e42",
  measurementId: "G-EX7Q73SCNT"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ----------------------------------------------------------------------

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  height: 800,
  overflowY: 'scroll' as 'scroll',
};

export function UserView() {
  const table = useTable();
  const [filterName, setFilterName] = useState('');
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const formik = useFormik({
    initialValues: {
      id: '',
      name: '',
      classna: '',
      section: '',
      rollNumber: '',
      email: '',
      dob: '',
      phoneNumber: '',
      address: '',
      avatarUrl: '',
      status: '',
      company: '',
      gender: '',
      studentId: '',
      isVerified: false,
    },
    validationSchema: Yup.object({
      id: Yup.string().required('Required'),
      name: Yup.string().required('Required'),
      classna: Yup.string().required('Required'),
      section: Yup.string().required('Required'),
      rollNumber: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
      dob: Yup.string().required('Required'),
      phoneNumber: Yup.string().required('Required'),
      address: Yup.string().required('Required'),
      avatarUrl: Yup.string().required('Required'),
      studentId: Yup.string().required('Required'),
      isVerified: Yup.boolean(),
      company: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        await addDoc(collection(db, 'students'), values);
        toast.success('Data Added Successfully', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Flip,
        });
        handleClose();
      } catch (error) {
        toast.error('Internal Server Error', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Flip,
        });
        console.error('Error adding document: ', error);
      }
    },
  });

  const dataFiltered: UserProps[] = applyFilter({
    inputData: _users,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <DashboardContent>
      <ToastContainer />
      <Card>
        <UserTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={_users.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    _users.map((user) => user.id)
                  )
                }
                headLabel={[
                  { id: 'ID', label: 'ID' },
                  { id: 'Name', label: 'Name' },
                  { id: 'Class', label: 'Class' },
                  { id: 'Section', label: 'Section' },
                  { id: 'Roll Number', label: 'Roll Number' },
                  { id: 'Actions', label: 'Actions' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <UserTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, _users.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={_users.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Button variant="contained" color="primary" sx={{ mt: 3 }} size='large' style={{ width: '30%' }} onClick={handleOpen}>
          Add Student
        </Button>
      </div>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" component="h2" gutterBottom>
            Add Student
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="ID"
              {...formik.getFieldProps('id')}
              error={formik.touched.id && Boolean(formik.errors.id)}
              helperText={formik.touched.id && formik.errors.id}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Name"
              {...formik.getFieldProps('name')}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Class"
              {...formik.getFieldProps('classna')}
              error={formik.touched.classna && Boolean(formik.errors.classna)}
              helperText={formik.touched.classna && formik.errors.classna}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Section"
              {...formik.getFieldProps('section')}
              error={formik.touched.section && Boolean(formik.errors.section)}
              helperText={formik.touched.section && formik.errors.section}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Roll Number"
              type="number"
              {...formik.getFieldProps('rollNumber')}
              error={formik.touched.rollNumber && Boolean(formik.errors.rollNumber)}
              helperText={formik.touched.rollNumber && formik.errors.rollNumber}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              type="email"
              {...formik.getFieldProps('email')}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Date of Birth"
              type="date"
              {...formik.getFieldProps('dob')}
              InputLabelProps={{ shrink: true }}
              error={formik.touched.dob && Boolean(formik.errors.dob)}
              helperText={formik.touched.dob && formik.errors.dob}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Phone Number"
              type="tel"
              {...formik.getFieldProps('phoneNumber')}
              error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
              helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Address"
              multiline
              rows={3}
              {...formik.getFieldProps('address')}
              error={formik.touched.address && Boolean(formik.errors.address)}
              helperText={formik.touched.address && formik.errors.address}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Avatar URL"
              {...formik.getFieldProps('avatarUrl')}
              error={formik.touched.avatarUrl && Boolean(formik.errors.avatarUrl)}
              helperText={formik.touched.avatarUrl && formik.errors.avatarUrl}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Status"
              {...formik.getFieldProps('status')}
              error={formik.touched.status && Boolean(formik.errors.status)}
              helperText={formik.touched.status && formik.errors.status}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Company"
              {...formik.getFieldProps('company')}
              error={formik.touched.company && Boolean(formik.errors.company)}
              helperText={formik.touched.company && formik.errors.company}
            />
            <Typography variant="body1" sx={{ mt: 2 }}>
              Gender:
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  onChange={formik.handleChange}
                  checked={formik.values.gender === 'male'}
                />
                Male
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  onChange={formik.handleChange}
                  checked={formik.values.gender === 'female'}
                />
                Female
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="other"
                  onChange={formik.handleChange}
                  checked={formik.values.gender === 'other'}
                />
                Other
              </label>
            </Box>
            <TextField
              fullWidth
              margin="normal"
              label="Student ID"
              {...formik.getFieldProps('studentId')}
              error={formik.touched.studentId && Boolean(formik.errors.studentId)}
              helperText={formik.touched.studentId && formik.errors.studentId}
            />
            <Typography variant="body1" sx={{ mt: 2 }}>
              Is Verified:
            </Typography>
            <Box>
              <label>
                <input
                  type="checkbox"
                  name="isVerified"
                  checked={formik.values.isVerified}
                  onChange={formik.handleChange}
                />
                Verified
              </label>
            </Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
              size="large"
              fullWidth
            >
              Submit
            </Button>
          </form>
        </Box>
      </Modal>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}