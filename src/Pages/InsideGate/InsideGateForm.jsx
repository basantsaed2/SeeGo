import React from "react";
import AddFieldSection from "@/components/AddFieldSection";

export default function InsideGateForm({ fields, values, onChange }) {
    return (
        <div className="w-full">
            <AddFieldSection fields={fields} values={values} onChange={onChange} />
        </div>
    );
}
