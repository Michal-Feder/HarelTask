import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle, Trash2, CheckCircle } from 'lucide-react';

const schema = z.object({
  products: z
    .array(
      z.object({
        name: z.string().min(1, 'יש להזין שם מוצר'),
        quantity: z
          .number({ invalid_type_error: 'יש להזין מספר' })
          .min(1, 'כמות חייבת להיות מספר חיובי'),
      })
    )
    .min(1, 'יש להזין לפחות מוצר אחד'),
});

const ProductForm = () => {
  const [successMessage, setSuccessMessage] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    trigger,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { products: [{ name: '', quantity: 1 }] },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'products',
  });

  const onSubmit = (data) => {
    console.log('Submitted:', data);
    setSuccessMessage(true);
    setTimeout(() => setSuccessMessage(false), 2000);
  };

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const res = await fetch(
          'https://run.mocky.io/v3/ce7bc973-8ca6-476b-b033-5595d96b6972'
        );
        if (!res.ok) throw new Error('שגיאה בטעינת נתונים');
        const data = await res.json();
        reset({ products: data });
      } catch (err) {
        console.error(err);
      }
    };
    fetchInitial();
  }, [reset]);

  const canAddNew = async () => {
    const valid = await trigger();
    return valid;
  };

  return (
    <div dir="rtl" className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">טופס מוצרים</h2>

      {successMessage && (
        <div className="animate-fadeInOut flex items-center gap-2 p-4 mb-4 bg-green-100 border border-green-300 rounded text-green-800 transition-opacity duration-300 ease-in-out">
          <CheckCircle className="w-5 h-5" />
          <span>הטופס נשלח בהצלחה!</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid grid-cols-12 gap-4 mb-4 items-center"
          >
            <div className="col-span-5">
              <input
                type="text"
                {...register(`products.${index}.name`)}
                placeholder="שם מוצר"
                className="w-full border rounded px-3 py-2"
              />
              {errors.products?.[index]?.name && (
                <p className="text-red-500 text-sm">
                  {errors.products[index].name.message}
                </p>
              )}
            </div>
            <div className="col-span-4">
              <input
                type="number"
                {...register(`products.${index}.quantity`, {
                  valueAsNumber: true,
                  min: 1,
                })}
                placeholder="כמות"
                min="1"
                className="w-full border rounded px-3 py-2"
              />
              {errors.products?.[index]?.quantity && (
                <p className="text-red-500 text-sm">
                  {errors.products[index].quantity.message}
                </p>
              )}
            </div>
            <div className="col-span-2">
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-red-500 hover:text-red-700"
                title="מחק"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}

        <div className="flex gap-4 mt-4">
          <button
            type="button"
            onClick={async () => {
              if (await canAddNew()) {
                append({ name: '', quantity: 1 });
              }
            }}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <PlusCircle className="w-5 h-5 ml-1" /> הוסף שורה
          </button>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={!isValid}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md disabled:opacity-50"
          >
            שלח
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
