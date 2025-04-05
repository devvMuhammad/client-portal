export default function DownloadReport() {
  return (
    <section className="section-container">
      <div className="w-full p-8 bg-omegaDarker rounded-xl flex flex-col gap-4 md:flex-row justify-between items-center">
        <div className="flex flex-col md:gap-4">
          <h2 className=" text-betaLight text-xl">
            The latest IT market analysis report - May 2020
          </h2>
          <p className="text-omega text-center md:text-left">
            This month&apos;s analysis is a must see
          </p>
        </div>
        <div className="flex justify-end">
          <button className="download-report hover:bg-omegaDark hover:border-omegaDark">
            Download Report
          </button>
        </div>
      </div>
    </section>
  );
}
