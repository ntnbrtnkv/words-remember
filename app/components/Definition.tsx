import type { Definition, Tag } from "@prisma/client";
import type { ChangeEventHandler } from "react";
import React, { useEffect, useState } from "react";
import { useDrag } from "react-dnd";
import { BurgerMenu } from "~/icons/BurgerMenu";
import { Pencil } from "~/icons/Pencil";
import { Cross } from "~/icons/Cross";
import Input from "~/components/Input";
import { Save } from "~/icons/Save";
import { useFetcher } from "@remix-run/react";
import { Delete } from "~/icons/Delete";
import Textarea from "~/components/Textarea";
import Button from "~/components/Button";

type Props = {
  def: Definition;
  tag: Tag;
  isNew?: boolean;
  onCancel?: () => void;
  onSuccess?: () => void;
};

export default function DefinitionComponent({
  def,
  tag,
  isNew = false,
  onCancel,
  onSuccess,
}: Props) {
  const [, drag, dragPreview] = useDrag(() => ({
    type: "definition",
    item: def,
  }));
  const fetcher = useFetcher();
  const [editing, setEditing] = useState(isNew);
  const [values, setValues] = useState({
    word: def.word,
    description: def.description,
  });

  const handleChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (event) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  useEffect(() => {
    if (fetcher.type === "done" && onSuccess && isNew) {
      onSuccess();
    }
  }, [fetcher]);

  const handleSave = async () => {
    if (isNew) {
      const form = new FormData();
      form.set("word", values.word);
      form.set("description", values.description);
      form.set("tagId", tag.id);

      await fetcher.submit(form, {
        action: "/defs?index",
        method: "post",
      });
    } else {
      const form = new FormData();
      form.set("word", values.word);
      form.set("description", values.description);

      await fetcher.submit(form, {
        action: `/defs/${def.id}`,
        method: "patch",
      });
      setEditing(false);
    }
  };

  const handleDelete = async () => {
    await fetcher.submit(null, {
      action: `/defs/${def.id}`,
      method: "delete",
    });

    setEditing(false);
  };

  const handleStartEditing = () => {
    setValues({
      word: def.word,
      description: def.description,
    });
    setEditing(true);
  };

  const handleCancel = () => {
    if (isNew && onCancel) {
      onCancel();
    } else {
      setEditing(false);
    }
  };

  return (
    <div
      ref={dragPreview}
      className="grid w-full grid-cols-1-auto-1 grid-rows-1 items-center gap-4 rounded bg-bgAccent p-4 text-textMain shadow-sm"
    >
      {editing ? (
        <>
          <div className="flex h-full flex-row items-start">
            {!isNew && (
              <Button
                appearance="secondary"
                onClick={handleDelete}
                title="Delete"
              >
                <Delete />
              </Button>
            )}
          </div>
          <div className="flex flex-col space-y-4">
            <Input
              name="word"
              value={values.word}
              onChange={handleChange}
              autoFocus
            />
            <Textarea
              name="description"
              value={values.description}
              onChange={handleChange}
            />
          </div>
          <section className="flex h-full flex-col place-content-between space-y-4">
            <Button appearance="secondary" onClick={handleSave} title="Save">
              <Save />
            </Button>
            <Button
              appearance="secondary"
              onClick={handleCancel}
              title="Cancel"
            >
              <Cross />
            </Button>
          </section>
        </>
      ) : (
        <>
          <span ref={drag} className="p-2">
            <BurgerMenu className="cursor-grab" />
          </span>
          <div className="truncate">
            <h2 className="font-bold">{def.word}</h2>
            <div>{def.description}</div>
          </div>
          <Button
            appearance="secondary"
            onClick={handleStartEditing}
            title="Edit"
          >
            <Pencil />
          </Button>
        </>
      )}
    </div>
  );
}
