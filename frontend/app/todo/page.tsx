"use client";

import React, { useEffect, useState, Fragment } from "react";
import { useSearchParams } from "next/navigation";
import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";

export default function TodoList() {
  const searchParams = useSearchParams();

  const id = searchParams.get("id");
  const [location, setLocation] = useState("");
  const [tempC, setTempC] = useState("");
  const [tempF, setTempF] = useState("");
  const [todoItems, setTodoItems] = useState([]);

  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");

  useEffect(() => {
    const checkUserExists = async () => {
      const response = await fetch(`/api/user/${id}`, {
        method: "GET",
      });
      if (!response.ok) {
        const response = await fetch(`api/user`, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            id,
            name: "TestUser",
          }),
        });
        console.log(response);
      } else {
        const data = await response.json();
        // console.log(data.user.todo_list);
        setTodoItems(data.user.todo_list);
      }
    };
    checkUserExists();
  }, []);

  useEffect(() => {
    const getWeatherData = async () => {
      const response = await fetch(`/api/weather`, {
        method: "GET",
      });
      const weatherData = await response.json();
      setLocation(weatherData.location);
      setTempC(weatherData.temp_c);
      setTempF(weatherData.temp_f);
    };

    getWeatherData();
  }, []);

  const createTodoItem = async () => {
    const timestamp = Date.now();
    const response = await fetch(`api/todo`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        id: timestamp,
        user_id: id,
        description,
      }),
    });
    console.log(response);
    setTodoItems([
      ...todoItems,
      {
        description: {
          S: description,
        },
        id: {
          S: timestamp,
        },
      },
    ]);
  };

  const deleteTodoItem = async (postId: string) => {
    const response = await fetch(`api/todo`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        id: postId,
        user_id: id,
      }),
    });
    console.log(response);
  };

  return (
    <div>
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            Weather
          </h3>
          <div className="mt-5">
            <div className="rounded-md bg-gray-50 px-6 py-5 sm:flex sm:items-start sm:justify-between">
              <h4 className="sr-only">Visa</h4>
              <div className="sm:flex sm:items-start">
                <div className="mt-3 sm:ml-4 sm:mt-0">
                  <div className="text-sm font-medium text-gray-900">
                    {location}
                  </div>
                  <div className="mt-1 text-sm text-gray-600 sm:flex sm:items-center">
                    <div>Temperature</div>
                    <span
                      className="hidden sm:mx-2 sm:inline"
                      aria-hidden="true"
                    >
                      &middot;
                    </span>
                    <div className="mt-1 sm:mt-0">
                      {tempC} C, {tempF} F
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 pt-10">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Todo Items
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all your todo items
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Add Item
            </button>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-0"
                    >
                      <span className="sr-only">Delete</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {todoItems &&
                    todoItems.map((todo) => {
                      return (
                        <tr key={todo.id["S"]}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                            {todo.description["S"]}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                            <a
                              onClick={() => {
                                deleteTodoItem(todo.id["S"]);

                                const newTodoItems = [];
                                for (const item of todoItems) {
                                  if (item.id["S"] !== todo.id["S"]) {
                                    newTodoItems.push(item);
                                  }
                                }

                                setTodoItems(newTodoItems);
                              }}
                              href="#"
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Delete
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                  <div>
                    <div className="text-center sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        Add Todo Item
                      </Dialog.Title>
                      <div className="mt-5">
                        <input
                          type="text"
                          name="text"
                          id="text"
                          onChange={(e) => {
                            setDescription(e.target.value);
                          }}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          placeholder=""
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      onClick={() => {
                        createTodoItem();
                        setOpen(false);
                      }}
                    >
                      Create
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
