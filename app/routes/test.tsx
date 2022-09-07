import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { requireUserId } from "~/session.server";
import { getTestDefinitions } from "~/models/definition.server";
import { changeKnowledge } from "~/models/knowledge.server";
import type { Definition } from "@prisma/client";
import { useFetcher } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import InsidePage from "~/components/InsidePage";
import Button from "~/components/Button";
import { Loading } from "~/icons/Loading";

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

export const meta: MetaFunction = () => {
  return {
    title: "Test",
  };
};

export default function TestPage() {
  const fetcher = useFetcher<ActionData>();
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const [selected, setSelected] = useState<Definition | null>(null);
  const [answer, setAnswer] = useState<"right" | "wrong" | null>(null);

  const isLoading = ["submitting", "loading"].includes(fetcher.state);

  function submitAnswer(selected: Definition | null) {
    if (!selected) return;

    const formData = new FormData();

    if (selected.id === testingDef.id) {
      console.debug(selected);
      setAnswer("right");
      formData.append("knowledgeChange", `${selected.id}:1`);
    } else {
      console.debug({ selected, testingDef });
      setAnswer("wrong");
      formData.append("knowledgeChange", `${selected.id}:-1`);
      formData.append("knowledgeChange", `${testingDef.id}:-1`);
    }

    fetch("/test", {
      method: "post",
      body: formData,
    });
  }

  function nextTest() {
    if (isLoading) return;

    setSelected(null);
    setAnswer(null);
    fetcher.load("/test");
  }

  useEffect(() => {
    if (fetcher.type === "init") {
      fetcher.load("/test");
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeys);

    return () => {
      document.removeEventListener("keydown", handleKeys);
    };
  }, [selected, fetcher.data]);

  if (!fetcher.data) return null;

  const { defs, testingDef } = fetcher.data;

  const handleChange = (event: any) => {
    event.preventDefault();

    if (isLoading) return;

    const selectedDef = defs.find(
      (def) => def.id === event.nativeEvent.submitter.value
    );

    if (!selectedDef) return;

    setSelected(selectedDef);

    submitAnswer(selectedDef);
  };

  function handleKeys(event: KeyboardEvent) {
    if (isLoading) return;

    if (event.key === " " && selected !== null) {
      nextTest();
      return;
    }

    if (event.key < "1" || event.key > "3") return;

    refs.current[event.key as any]?.click();
  }

  return (
    <InsidePage>
      <form
        method="post"
        className="flex grow flex-col justify-center p-16"
        onSubmit={handleChange}
      >
        <h1 className="mb-16 text-center text-3xl font-bold uppercase">
          {testingDef.word}
        </h1>
        <div className="mb-16 flex flex-col space-y-8 md:flex-row md:justify-center md:space-x-8 md:space-y-0 ">
          {defs.map((def, index) => (
            <button
              key={def.id}
              type="submit"
              value={def.id}
              disabled={Boolean(selected) || isLoading}
              ref={(el) => (refs.current[index + 1] = el)}
              className={`
              full-w focus:outline-bold inline-block justify-between rounded bg-bgAccent p-4 text-textMainNotActive shadow-sm hover:text-textMain focus:text-textMain focus:outline-none focus:outline focus:outline-2 focus:outline-textMain
            ${
              testingDef.id === def.id && answer !== null ? "bg-green-500" : ""
            } ${
                selected?.id === def.id && answer === "wrong"
                  ? "bg-red-500"
                  : ""
              } 
              ${
                isLoading || selected
                  ? "cursor-not-allowed hover:text-textMainNotActive"
                  : ""
              }`}
            >
              <span>{index + 1}. </span>
              {def.description}
            </button>
          ))}
        </div>
        <Button
          appearance="primary"
          className="sticky bottom-4 min-w-[74px] self-end align-middle"
          disabled={isLoading}
          type="button"
          onClick={nextTest}
        >
          {isLoading ? <Loading height={24} /> : "Next"}
        </Button>
      </form>
    </InsidePage>
  );
}
