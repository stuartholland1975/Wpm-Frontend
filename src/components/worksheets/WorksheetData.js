import {createAsyncThunk, createEntityAdapter, createSlice} from "@reduxjs/toolkit";
import {newWorksheet} from "../../services/thunks";


const worksheetAdapter = createEntityAdapter()

const worksheetSlice = createSlice()