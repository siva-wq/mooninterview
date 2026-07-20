function Output({ data }) {

    const isSuccess = data?.success;

    const hasOutput = data?.output;

    let title = "Output";

    let colorClass =
        "text-success";

    if (hasOutput && !isSuccess) {

        title = "Error";

        colorClass =
            "text-danger";
    }

    return (

        <div className="w-full h-full bg-black flex flex-col overflow-hidden">

            {/* Header */}

            <div className="px-4 py-3 border-b border-gray-700 bg-[#161b22]">

                <h2
                    className={`text-lg font-semibold ${colorClass}`}
                >
                    {title}
                </h2>

            </div>



            {/* Output Body */}

            <div className="flex-1 overflow-auto p-4">

                <pre
                    className={`whitespace-pre-wrap text-sm ${colorClass}`}
                >

                    {data?.output || "Run code to see output..."}

                </pre>

            </div>

        </div>
    );
}

export default Output;