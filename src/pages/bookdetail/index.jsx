import { useLocation } from "react-router-dom";
import ViewDetail from "./ViewDetail";
import { useEffect, useState } from "react";
import { getBookId } from "../../services/apiServices";
import { original } from "@reduxjs/toolkit";

const BookPage = () => {
    let location = useLocation();
    let params = new URLSearchParams(location.search);
    let id = params?.get("id");
    const [dataBook, setDataBook] = useState({});

    useEffect(() => {
        getBookById(id);
    }, []);

    const getBookById = async (id) => {
        let res = await getBookId(id);
        if (res && res.data) {
            let raw = res.data;
            raw.items = getImage(raw);
            setDataBook(raw);
        }
    }

    const getImage = (raw) => {
        const images = [];
        if (raw.thumbnail) {
            images.push(
                {
                    original: `${import.meta.env.VITE_BACKEND_URL_AVATAR}/images/book/${raw.thumbnail}`,
                    thumbnail: `${import.meta.env.VITE_BACKEND_URL_AVATAR}/images/book/${raw.thumbnail}`,
                    originalClass: "original-image",
                    thumbnailClass: "thumbnail-image",
                }
            )
        }
        if (raw.slider) {
            raw.slider?.map(item => {
                images.push(
                    {
                        original: `${import.meta.env.VITE_BACKEND_URL_AVATAR}/images/book/${item}`,
                        thumbnail: `${import.meta.env.VITE_BACKEND_URL_AVATAR}/images/book/${item}`,
                        originalClass: "original-image",
                        thumbnailClass: "thumbnail-image",
                    }
                )
            })
        }
        return images;
    }

    return (
        <>
            <ViewDetail dataBook={dataBook} />
        </>
    )
}

export default BookPage;