import React, { useState } from "react";
import { Button, Input, Modal, Card } from "@launchpad/shared-ui";

const ComponentsShowcase: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  return (
    <div className="py-8 bg-gray-50 dark:bg-grafite-900 min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-grafite-50 mb-8 text-center">
          Launchpad UI Components Showcase
        </h1>

        {/* Button Components */}
        <Card className="mb-8">
          <div className="p-4">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-grafite-100">
              Button Components
            </h2>
          </div>
          <div className="p-4">
            <div className="space-y-6">
              {/* Primary Buttons */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 dark:text-grafite-200 mb-3">
                  Primary Variants
                </h3>
                <div className="flex flex-wrap gap-4">
                  <Button variant="primary" size="sm">
                    Small Primary
                  </Button>
                  <Button variant="primary" size="md">
                    Medium Primary
                  </Button>
                  <Button variant="primary" size="lg">
                    Large Primary
                  </Button>
                  <Button variant="primary" size="md" loading>
                    Loading...
                  </Button>
                  <Button variant="primary" size="md" disabled>
                    Disabled
                  </Button>
                </div>
              </div>

              {/* Secondary Buttons */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">
                  Secondary Variants
                </h3>
                <div className="flex flex-wrap gap-4">
                  <Button variant="secondary" size="sm">
                    Small Secondary
                  </Button>
                  <Button variant="secondary" size="md">
                    Medium Secondary
                  </Button>
                  <Button variant="secondary" size="lg">
                    Large Secondary
                  </Button>
                  <Button variant="secondary" size="md" loading>
                    Loading...
                  </Button>
                  <Button variant="secondary" size="md" disabled>
                    Disabled
                  </Button>
                </div>
              </div>

              {/* Outline Buttons */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">
                  Outline Variants
                </h3>
                <div className="flex flex-wrap gap-4">
                  <Button variant="outline" size="sm">
                    Small Outline
                  </Button>
                  <Button variant="outline" size="md">
                    Medium Outline
                  </Button>
                  <Button variant="outline" size="lg">
                    Large Outline
                  </Button>
                  <Button variant="outline" size="md" loading>
                    Loading...
                  </Button>
                  <Button variant="outline" size="md" disabled>
                    Disabled
                  </Button>
                </div>
              </div>

              {/* Ghost Buttons */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">
                  Ghost Variants
                </h3>
                <div className="flex flex-wrap gap-4">
                  <Button variant="ghost" size="sm">
                    Small Ghost
                  </Button>
                  <Button variant="ghost" size="md">
                    Medium Ghost
                  </Button>
                  <Button variant="ghost" size="lg">
                    Large Ghost
                  </Button>
                  <Button variant="ghost" size="md" loading>
                    Loading...
                  </Button>
                  <Button variant="ghost" size="md" disabled>
                    Disabled
                  </Button>
                </div>
              </div>

              {/* Destructive Buttons */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 dark:text-grafite-200 mb-3">
                  Destructive Variants
                </h3>
                <div className="flex flex-wrap gap-4">
                  <Button variant="destructive" size="sm">
                    Small Destructive
                  </Button>
                  <Button variant="destructive" size="md">
                    Medium Destructive
                  </Button>
                  <Button variant="destructive" size="lg">
                    Large Destructive
                  </Button>
                  <Button variant="destructive" size="md" loading>
                    Loading...
                  </Button>
                  <Button variant="destructive" size="md" disabled>
                    Disabled
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Input Components */}
        <Card className="mb-8">
          <div className="p-4">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-grafite-100">
              Input Components
            </h2>
          </div>
          <div className="p-4">
            <div className="space-y-6">
              {/* Default Inputs */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">
                  Default Inputs
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input placeholder="Default input" />
                  <Input
                    placeholder="Input with value"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  <Input placeholder="Disabled input" disabled />
                  <Input
                    placeholder="Error input"
                    error="This field has an error"
                  />
                </div>
              </div>

              {/* Filled Inputs */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">
                  Filled Inputs
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input variant="filled" placeholder="Filled input" />
                  <Input
                    variant="filled"
                    placeholder="Filled with value"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  <Input
                    variant="filled"
                    placeholder="Filled disabled"
                    disabled
                  />
                  <Input
                    variant="filled"
                    placeholder="Filled error"
                    error="This field has an error"
                  />
                </div>
              </div>

              {/* Outline Inputs */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">
                  Outline Inputs
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input variant="outline" placeholder="Outline input" />
                  <Input
                    variant="outline"
                    placeholder="Outline with value"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  <Input
                    variant="outline"
                    placeholder="Outline disabled"
                    disabled
                  />
                  <Input
                    variant="outline"
                    placeholder="Outline error"
                    error="This field has an error"
                  />
                </div>
              </div>

              {/* Default with Different Sizes */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">
                  Input Sizes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input size="sm" placeholder="Small input" />
                  <Input size="md" placeholder="Medium input" />
                  <Input size="lg" placeholder="Large input" />
                  <Input
                    placeholder="Input with helper text"
                    helperText="This is a helper text"
                  />
                </div>
              </div>

              {/* Password Inputs */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">
                  Password Inputs
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input type="password" placeholder="Password input" />
                  <Input
                    type="password"
                    placeholder="Password with value"
                    value={passwordValue}
                    onChange={(e) => setPasswordValue(e.target.value)}
                  />
                  <Input
                    type="password"
                    placeholder="Password disabled"
                    disabled
                  />
                  <Input
                    type="password"
                    placeholder="Password error"
                    error="Password is required"
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Card Components */}
        <Card className="mb-8">
          <div className="p-4">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-grafite-100">
              Card Components
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Default Card */}
              <Card>
                <div className="p-4">
                  <h3 className="text-lg font-semibold">Default Card</h3>
                </div>
                <div className="p-4">
                  <p className="text-gray-600 dark:text-grafite-300 mb-4">
                    This is a default card with medium padding and standard
                    styling.
                  </p>
                </div>
                <div className="p-4 border-t border-gray-200">
                  <Button variant="primary" size="sm">
                    Action
                  </Button>
                </div>
              </Card>

              {/* Elevated Card */}
              <Card variant="elevated">
                <div className="p-4">
                  <h3 className="text-lg font-semibold">Elevated Card</h3>
                </div>
                <div className="p-4">
                  <p className="text-gray-600 dark:text-grafite-300 mb-4">
                    This is an elevated card with large padding and enhanced
                    shadow.
                  </p>
                </div>
                <div className="p-4 border-t border-gray-200">
                  <Button variant="secondary" size="sm">
                    Learn More
                  </Button>
                </div>
              </Card>

              {/* Outlined Card */}
              <Card variant="outlined">
                <div className="p-4">
                  <h3 className="text-lg font-semibold">Outlined Card</h3>
                </div>
                <div className="p-4">
                  <p className="text-gray-600 dark:text-grafite-300 mb-4">
                    This is an outlined card with small padding and border
                    styling.
                  </p>
                </div>
                <div className="p-4 border-t border-gray-200">
                  <Button variant="outline" size="sm">
                    Details
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </Card>

        {/* Modal Component */}
        <Card className="mb-8">
          <div className="p-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Modal Component
            </h2>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              <p className="text-gray-600">
                Click the button below to open a modal dialog.
              </p>
              <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                Open Modal
              </Button>
            </div>
          </div>
        </Card>

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Example Modal"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              This is an example modal dialog. You can put any content here.
            </p>
            <Input
              placeholder="Enter some text..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  alert(`You entered: ${inputValue}`);
                  setIsModalOpen(false);
                }}
              >
                Confirm
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ComponentsShowcase;
