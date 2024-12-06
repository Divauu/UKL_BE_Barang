import Express from "express";
import UserRoute from "./router/userRouter"
import ItemRoute from "./router/itemRouter"
import PeminjamanRoute from "./router/peminjamanRouter"

const app = Express()

app.use(Express.json())

app.use(`/user`, UserRoute)
app.use(`/item`, ItemRoute)
app.use(`/peminjaman`, PeminjamanRoute)

const PORT = 1229
app.listen(PORT, () => {
    console.log(`Server Pengelolaan Barang run on port ${PORT}`)
})