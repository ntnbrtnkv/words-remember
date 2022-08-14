import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { requireUserId } from "~/session.server";
import { getTestDefinitions } from "~/models/definition.server";
import { changeKnowledge } from "~/models/knowledge.server";
import type { Definition } from "@prisma/client";
import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";

type ActionData = {
  defs: Definition[];
  testingDef: Definition;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const defs = await getTestDefinitions({ userId });

  return {
    defs,
    testingDef: defs[Math.floor(Math.random() * defs.length)],
  };
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const knowledgeChanges = formData.getAll("knowledgeChange");

  await Promise.all(
    knowledgeChanges.map((knowledgeChange) => {
      const [definitionId, change] = (knowledgeChange as string).split(":");
      const numberChange = Number(change);

      if (numberChange !== -1 && numberChange !== 1) {
        return;
      }

      changeKnowledge({ definitionId, userId, change: numberChange });
    })
  );

  return null;
};

export default function TestPage() {
  const fetcher = useFetcher<ActionData>();
  const [selected, setSelected] = useState<Definition | null>(null);
  const [answer, setAnswer] = useState<"right" | "wrong" | null>(null);

  useEffect(() => {
    if (fetcher.type === "init") {
      fetcher.load("/test");
    }
  }, []);

  if (!fetcher.data) return null;

  const { defs, testingDef } = fetcher.data;

  function handleChange(event: any) {
    event.preventDefault();

    const selectedDef = defs.find(
      (def) => def.id === event.nativeEvent.submitter.value
    );

    if (!selectedDef) return;

    setSelected(selectedDef);

    const formData = new FormData();

    if (selectedDef.id === testingDef.id) {
      console.debug(selectedDef);
      setAnswer("right");
      formData.append("knowledgeChange", `${selectedDef.id}:1`);
    } else {
      console.debug({ selectedDef, testingDef });
      setAnswer("wrong");
      formData.append("knowledgeChange", `${selectedDef.id}:-1`);
      formData.append("knowledgeChange", `${testingDef.id}:-1`);
    }

    fetch("/test", {
      method: "post",
      body: formData,
    });
  }

  const nextTest = () => {
    setSelected(null);
    setAnswer(null);
    fetcher.load("/test");
  };

  return (
    <form method="post" onSubmit={handleChange}>
      <div>{testingDef.word}</div>
      <div className="flex space-x-4">
        {defs.map((def) => (
          <button
            key={def.id}
            type="submit"
            value={def.id}
            className={`
              border-black
              border-2
              border-solid
            ${
              testingDef.id === def.id && answer !== null ? "bg-green-500" : ""
            } ${
              selected?.id === def.id && answer === "wrong" ? "bg-red-500" : ""
            }`}
          >
            {def.description}
          </button>
        ))}
      </div>
      <button type="button" onClick={nextTest}>
        next
      </button>
    </form>
  );
}
