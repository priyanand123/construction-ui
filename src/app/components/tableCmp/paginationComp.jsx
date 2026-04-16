import React, { memo } from "react";
import styled from "styled-components";

const PaginationComp = ({
  canPreviousPage,
  pageIndex,
  previousPage,
  canNextPage,
  nextPage,
  pageCount,
  gotoPage,
}) => {
  const activePage = pageIndex + 1;

  const filterPages = (visiblePages, totalPages) => {
    return visiblePages.filter((page) => page <= totalPages);
  };

  const getVisiblePages = (page, total) => {
    if (total < 7) {
      return filterPages([1, 2, 3, 4, 5, 6], total);
    } else {
      if (page % 5 >= 0 && page > 4 && page + 2 < total) {
        return [1, page - 1, page, page + 1, total];
      } else if (page % 5 >= 0 && page > 4 && page + 2 >= total) {
        return [1, total - 3, total - 2, total - 1, total];
      } else {
        return [1, 2, 3, 4, 5, total];
      }
    }
  };

  const visiblePages = getVisiblePages(pageIndex, pageCount);

  return (
    <PaginationConatiner className="pagination d-flex flex-wrap flex-lg-nowrap">
      <li className={`page-item  ${!canPreviousPage && "disabled"}`}>
        <a className="page-link text-gray" onClick={() => previousPage()}>
          Previous
        </a>
      </li>
      {visiblePages.map((page, index, array) => {
        return (
          <>
            <li
              className={`page-item ${activePage === page && "active"}`}
              aria-current="page"
            >
              <a
                className="page-link border"
                href="#"
                onClick={() => gotoPage(Number(page) - 1)}
              >
                {array[index - 1] + 2 < page ? `...${page}` : page}
              </a>
            </li>
          </>
        );
      })}

      <li className={`page-item  ${!canNextPage && "disabled"}`}>
        <a className="page-link text-gray" href="#" onClick={nextPage}>
          Next
        </a>
      </li>
    </PaginationConatiner>
  );
};

export default memo(PaginationComp);

const PaginationConatiner = styled.ul`
  li {
    cursor: pointer;
  }
  a {
    padding: 0.5rem 0.7rem;
    font-size: 1em;
  }
`;
