import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const createPeminjaman = async (req: Request, res: Response): Promise<any> => {
  try {
    const { user_id, item_id, borrow_date, return_date } = req.body;

    const item = await prisma.item.findUnique({
      where: { id: item_id },
    });

    if (!item) {
      return res.status(404).json({ message: "Barang tidak ditemukan" });
    }

    if (item.quantity <= 0) {
      return res.status(400).json({ message: "Barang tidak tersedia" });
    }

    const peminjaman = await prisma.peminjaman.create({
      data: {
        user_id,
        item_id,
        borrow_date: new Date(borrow_date),
        return_date: new Date(return_date),
      },
    });

    await prisma.item.update({
      where: { id: item_id },
      data: { quantity: { decrement: 1 } },
    });
    const response = {
        ...peminjaman,
        actual_return_date: null,
      };

    return res.status(201).json({
      status: `Success`,
      message: `Peminjaman berhasil dicatat`,
      data: peminjaman,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json(error);
  }
};

const readPeminjaman = async (req: Request, res: Response): Promise<any> => {
  try {
    const peminjaman = await prisma.peminjaman.findMany({
      include: {
        user_detail: { select: { id: true, username: true, roles: true } },
        item_detail: { select: { id: true, name: true, category: true, location: true } },
      },
    });

    return res.status(200).json({
      status: `Success`,
      message: "Data peminjaman berhasil diambil",
      data: peminjaman,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const returnItem = async (req: Request, res: Response): Promise<any> => {
    try {
      const { id, return_date } = req.body;
  
      // Validasi apakah peminjaman dengan ID ini ada
      const peminjaman = await prisma.peminjaman.findUnique({
        where: { id },
      });
  
      if (!peminjaman) {
        return res.status(404).json({ message: "Peminjaman tidak ditemukan" });
      }
  
      // Update data pengembalian
      const updatedPeminjaman = await prisma.peminjaman.update({
        where: { id },
        data: {
          actual_return_date: new Date(return_date),
          updatedAt: new Date(),
        },
      });
  
      // Kembalikan stok barang
      await prisma.item.update({
        where: { id: peminjaman.item_id },
        data: { quantity: { increment: 1 } },
      });
  
      return res.status(200).json({
        status: `Success`,
        message: `Pengembalian berhasil dicatat`,
        data: updatedPeminjaman,
      });
    } catch (error) {
        console.log(error)
      return res.status(500).json(error);
    }
  };
  
  const usageReport = async (req: Request, res: Response): Promise<void> => {
    try {
        const { start_date, end_date, group_by } = req.body;

        const borrowData = await prisma.peminjaman.findMany({
            where: {
                borrow_date: {
                    gte: new Date(start_date),
                    lte: new Date(end_date),
                },
            },
            include: {
                item_detail: true, // Include relation ke tabel Items
            },
        });

        const returnData = await prisma.peminjaman.findMany({
            where: {
                actual_return_date: {
                    gte: new Date(start_date),
                    lte: new Date(end_date),
                },
            },
        });

        // Grup data berdasarkan group_by
        const groupedData = borrowData.reduce((acc: Record<string, any>, borrow) => {
            const group = borrow.item_detail[group_by as keyof typeof borrow.item_detail] as string; // Type assertion
            if (!acc[group]) {
                acc[group] = {
                    group,
                    total_borrowed: 0,
                    total_returned: 0,
                    items_in_use: 0,
                };
            }

            acc[group].total_borrowed++;
            if (returnData.some((r) => r.id)) {
                acc[group].total_returned++;
            } else {
                acc[group].items_in_use++;
            }

            return acc;
        }, {});

        // Ubah objek menjadi array
        const usageAnalysis = Object.values(groupedData);

        // Format respons
        res.status(200).json({
            status: "success",
            data: {
                analysis_period: {
                    start_date,
                    end_date,
                },
                usage_analysis: usageAnalysis,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
};

export { createPeminjaman, readPeminjaman, returnItem, usageReport }