import { useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { saveLocalItem } from "../lib/localItems";

const fileSchema = Yup.mixed()
  .required("Required")
  .test("fileSize","File too large",v=>!v||v.size<=5*1024*1024)
  .test("fileType","Unsupported file",v=>!v||["image/jpeg","image/png","image/webp","image/gif"].includes(v.type));

const schema = Yup.object({
  title: Yup.string().required("Required"),
  category: Yup.string().required("Required"),
  price: Yup.number().typeError("Must be a number").min(0,">= 0").required("Required"),
  description: Yup.string().min(5,"Too short").required("Required"),
  imgFile: fileSchema
});

const toB64 = (file) => new Promise((res,rej)=>{const r=new FileReader();r.onloadend=()=>res(r.result);r.onerror=rej;r.readAsDataURL(file);});

export default function AddProductForm({ onAdd }) {
  const [open,setOpen]=useState(false);
  const ref=useRef(null);

  return (
    <div className="max-w-5xl mx-auto">
      <button onClick={()=>setOpen(v=>!v)} className="dark:bg-blue-950/30 bg-violet-500/50 hover:bg-violet-500/60 hover:dark:bg-blue-950 transition-colors duration-300 shadow-lg rounded-3xl px-4 py-2">
        Add Product
      </button>

      <div className="overflow-hidden transition-all duration-500 ease-in-out mt-2 shadow-lg rounded-3xl backdrop-blur-[2px] max-w-96" style={{maxHeight: open? "700px" : 0}}>
        <div className="dark:bg-blue-950/30 bg-white/5 p-4 rounded-2xl">
          <Formik
            innerRef={ref}
            initialValues={{ title:"", category:"", price:"", description:"", imgFile:null }}
            validationSchema={schema}
            onSubmit={async (v,{resetForm})=>{
              const images = [];
              if (v.imgFile) images.push(await toB64(v.imgFile));
              const product = {
                id:`local-${Date.now()}`,
                title: v.title.trim(),
                category: v.category.trim(),
                price: Number(v.price)||0,
                description: v.description.trim(),
                image: images[0] || null,
                images,
                source: "local",
                createdAt: new Date().toISOString()
              };
              try{ saveLocalItem(product); }catch{}
              onAdd?.(product);
              resetForm();
              setOpen(false);
            }}
          >
            {({setFieldValue,values})=>(
              <Form className="space-y-4">
                <div className="text-center text-base rounded-2xl py-2 bg-white/60 dark:bg-white/10">Choose File</div>
                <div className="relative">
                  <input type="file" accept="image/*" onChange={e=>setFieldValue("imgFile", e.currentTarget.files?.[0]||null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <div className="border p-2 rounded-2xl bg-white/60 dark:bg-white/10 text-sm">{values?.imgFile?.name || "Choose file"}</div>
                </div>
                <div className="text-red-500 text-xs"><ErrorMessage name="imgFile"/></div>

                <Field name="title" placeholder="Product Name" className="w-full rounded-2xl p-3 dark:bg-slate-800/30"/>
                <div className="text-red-500 text-xs"><ErrorMessage name="title"/></div>

                <Field name="category" placeholder="Category" className="w-full rounded-2xl p-3 dark:bg-slate-800/30"/>
                <div className="text-red-500 text-xs"><ErrorMessage name="category"/></div>

                <Field name="price" type="number" step="0.01" placeholder="Price" className="w-full rounded-2xl p-3 dark:bg-slate-800/30"/>
                <div className="text-red-500 text-xs"><ErrorMessage name="price"/></div>

                <Field as="textarea" name="description" rows={3} placeholder="Description" className="w-full rounded-2xl p-3 dark:bg-slate-800/30"/>
                <div className="text-red-500 text-xs"><ErrorMessage name="description"/></div>

                <button type="submit" className="px-4 py-2 rounded-2xl bg-violet-500/70 hover:bg-violet-500/80 hover:dark:bg-blue-950 transition-colors duration-300 shadow">Add</button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

