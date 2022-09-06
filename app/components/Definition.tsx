import type { Definition, Knowledge, Tag } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { useDrag } from "react-dnd";
import { BurgerMenu } from "~/icons/BurgerMenu";
import { Pencil } from "~/icons/Pencil";
import { Cross } from "~/icons/Cross";
import Input from "~/components/Input";
import { useFetcher } from "@remix-run/react";
import { Delete } from "~/icons/Delete";
import Textarea from "~/components/Textarea";
import Button from "~/components/Button";
import { useForm } from "react-hook-form";
import { Loading } from "~/icons/Loading";
import { Save } from "~/icons/Save";

type Props = {
  def: Definition;
  tag: Tag;
  knowledge?: Knowledge;
  isNew?: boolean;
  onCancel?: () => void;
  onSuccess?: () => void;
};

type FormValues = {
  word: string;
  description: string;
};

export default function DefinitionComponent({
  def,
  tag,
  knowledge,
  isNew = false,
  onCancel,
  onSuccess,
}: Props) {
  const [, drag, dragPreview] = useDrag(() => ({
    type: "definition",
    item: def,
  }));
  const saveFetcher = useFetcher();
  const deleteFetcher = useFetcher();
  const [editing, setEditing] = useState(isNew);

  const isPerformingAction =
    saveFetcher.state === "submitting" || deleteFetcher.state === "submitting";

  const { register, reset, handleSubmit } = useForm<FormValues>();

  useEffect(() => {
    if (saveFetcher.type === "done") {
      if (onSuccess && isNew) {
        onSuccess();
      }
      console.log(123);
      setEditing(false);
    }
  }, [saveFetcher]);

  const handleSave = async (values: FormValues) => {
    if (isNew) {
      const form = new FormData();
      form.set("word", values.word);
      form.set("description", values.description);
      form.set("tagId", tag.id);

      saveFetcher.submit(form, {
        action: "/defs?index",
        method: "post",
      });
    } else {
      const form = new FormData();
      form.set("word", values.word);
      form.set("description", values.description);

      saveFetcher.submit(form, {
        action: `/defs/${def.id}`,
        method: "patch",
      });
    }
  };

  const handleDelete = async () => {
    await deleteFetcher.submit(null, {
      action: `/defs/${def.id}`,
      method: "delete",
    });
  };

  const handleStartEditing = () => {
    reset();
    setEditing(true);
  };

  const handleCancel = () => {
    if (isNew && onCancel) {
      onCancel();
    } else {
      setEditing(false);
    }
  };

  const autoFocusDescription = isNew && !!def.word;

  return (
    <div
      ref={dragPreview}
      className={`grid w-full grid-cols-1-auto-1 grid-rows-1 items-center gap-4 rounded bg-bgAccent p-4 text-textMain shadow-sm ${
        isPerformingAction && "bg-disabledLight"
      }`}
    >
      {editing ? (
        <form className="contents" onSubmit={handleSubmit(handleSave)}>
          <div className="flex h-full flex-row items-start">
            {!isNew && (
              <Button
                appearance="secondary"
                onClick={handleDelete}
                title="Delete"
                disabled={isPerformingAction}
              >
                {isPerformingAction && deleteFetcher.state === "submitting" ? (
                  <Loading />
                ) : (
                  <Delete />
                )}
              </Button>
            )}
          </div>
          <div className="flex flex-col space-y-4">
            <Input
              {...register("word", { disabled: isPerformingAction })}
              defaultValue={def.word}
              placeholder="Word"
              autoFocus={!autoFocusDescription}
            />
            <Textarea
              {...register("description", {
                required: true,
                disabled: isPerformingAction,
              })}
              placeholder="Definition"
              defaultValue={def.description}
              autoFocus={autoFocusDescription}
            />
          </div>
          <section className="flex h-full flex-col place-content-between space-y-4">
            <Button
              appearance="secondary"
              type="submit"
              title="Save"
              disabled={isPerformingAction}
            >
              {isPerformingAction && saveFetcher.state === "submitting" ? (
                <Loading />
              ) : (
                <Save />
              )}
            </Button>
            <Button
              appearance="secondary"
              onClick={handleCancel}
              title="Cancel"
              disabled={isPerformingAction}
            >
              <Cross />
            </Button>
          </section>
        </form>
      ) : (
        <>
          <span ref={drag} className="p-2">
            <BurgerMenu className="cursor-grab" />
          </span>
          <div className="flex truncate">
            <div className="truncate">
              <h2 className="font-bold">{def.word}</h2>
              <div>{def.description}</div>
            </div>
            {knowledge && (
              <div className="flex grow items-center justify-end">
                {knowledge.right}/{knowledge.right + knowledge.wrong}
              </div>
            )}
          </div>
          <Button
            appearance="secondary"
            onClick={handleStartEditing}
            title="Edit"
            disabled={isPerformingAction}
          >
            <Pencil />
          </Button>
        </>
      )}
    </div>
  );
}
