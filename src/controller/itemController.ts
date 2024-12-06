import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient({errorFormat: `minimal`})

const createItem = async (req: Request, res: Response): Promise<any> => {
    try {
        const name: string = req.body.name
        const category: string = req.body.category
        const location: string = req.body.location
        const quantity: number = Number(req.body.quantity)

        const newItem = await prisma.item.create({
            data: {
                name, category, location, quantity
            }
        })
        return res.status(200).json({
            status: `Success`,
            message: `Barang berhasil ditambahkan`,
            data: newItem
        })
    } catch (error) {
        return res.status(500).json(error)
    }
}

const readItem = async (
    req: Request, 
    res: Response
): Promise<any> => {
    try {
        const id = req.params.id;
        const allItem = await prisma.item.findUnique({
            where: {
                id: Number(id)
            }
        })

        if(!allItem){
            return res.status(200).json({
                message: "Barang tidak ditemukan"
            })
        }
        return res.status(200).json({
            message: `Data barang berhasil ditemukan`,
            data: allItem
        })
    } catch (error) {
        res.status(500).json(error)
    }
}

const updateItem = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = req.params.id
        const findItem = await prisma.item.findFirst({
            where: { id: Number(id) }
        })
        
        if(!findItem) {
            return res.status(404).json({ message: `Item not found`})
        }

        const { name, category, location, quantity } = req.body
        const saveItem = await prisma.item.update({
            where: { id: Number(id) },
            data: {
                name: name ? name : findItem.name,
                category: category ? category : findItem.category,
                location: location ? location : findItem.location,
                quantity: quantity ? Number(quantity) : findItem.quantity
            }
        })
        return res.status(200).json({
            status: `Success`,
            message: `Barang berhasil diubah`,
            data: saveItem
        })
    } catch (error) {
        return res.status(500).json(error)
    }
}

const deleteItem = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = req.params.id
        const findItem = await prisma.item.findFirst({
            where: { id: Number(id) }
        })

        if(!findItem) {
            return res.status(200).json({
                meesage: `Item is not found`
            })
        }

        const saveItem = await prisma.item.delete({
            where: { id: Number(id) }
        })
        return res.status(200).json({ 
            status: `Success`,
            message: `Barang berhasil dihapus`,
            data: saveItem
        })
    } catch (error) {
        return res.status(500).json(error)
    }
}

export { createItem, updateItem, readItem, deleteItem }