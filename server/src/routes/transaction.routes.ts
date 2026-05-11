import { Router } from "express";
import { handleCreateEntry, handleDeleteEntryById, handleGetAllEntriesByUserId, handleUpdateEntryById } from "../controllers/transaction.controller";
import { validateBody, validateParams } from "../middleware/validate.middleware";
import { getByIdGlobal, getByUserIdGlobal } from "../utils/validators/global.validator";
import { createEntrySchema, updateEntrySchema } from "../utils/validators/transaction.validator";

const router = Router()

router.get('/', validateParams(getByUserIdGlobal), handleGetAllEntriesByUserId)
router.post('/', validateBody(createEntrySchema), handleCreateEntry)
router.patch('/:id', validateParams(getByIdGlobal), validateBody(updateEntrySchema), handleUpdateEntryById)
router.delete('/:id', validateParams(getByIdGlobal), handleDeleteEntryById)

export default router